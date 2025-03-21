import { AddressDb, AssociateDb, AssociateDetailDb, WorkplaceDb } from "../../../../../persistence/definitions";
import CommandHandler from "../../../../../abstractions/interfaces/command-handler";
import CommandResponse from "../../../../../abstractions/interfaces/command-response";
import Address from "../../../../../domain/entities/address";
import Associate from "../../../../../domain/entities/associate";
import AssociateDetail from "../../../../../domain/entities/associate-detail";
import Workplace from "../../../../../domain/entities/workplace";
import AddressInfo from "../../../../../domain/interfaces/address-info";
import AssociateDetailInfo from "../../../../../domain/interfaces/associate-detail-info";
import BeneficiaryInfo from "../../../../../domain/interfaces/beneficiary-info";
import NameInfo from "../../../../../domain/interfaces/name-info";
import WorkplaceInfo from "../../../../../domain/interfaces/workplace-info";
import ErrorCodes from "../../../../../domain/types/error-codes";
import CreateAssociateCommandValidator from "./create-associate-command-validator";

interface CreateAssociateCommand {
  commandId?: string;
  name: NameInfo;
  rfc: string;
  gender: string;
  detail: AssociateDetailInfo;
  address: AddressInfo;
  workplace: WorkplaceInfo;
  beneficiaries: BeneficiaryInfo[];
}

class CreateAssociateCommandHandler implements CommandHandler<CreateAssociateCommand, CommandResponse> {
  execute = async(data: CreateAssociateCommand): Promise<CommandResponse> => {
    const validation = new CreateAssociateCommandValidator(data).validate();

    if (validation.length > 0) {
      return {
        successful: false,
        code: ErrorCodes.API_CMD_HANDLER_VALIDATION,
        message: 'Ocurrieron algunos errores de validación, favor de revisarlos.',
        type: 'danger',
        errors: [...validation.map((rule) => (rule.message))]
      } as CommandResponse;
    }

    try {
      const associate = new Associate(data.name, data.rfc, data.gender)
      .updateDetail(new AssociateDetail(data.detail))
      .updateAddress(new Address(data.address))
      .updateWorkplace(new Workplace(data.workplace.key, data.workplace.name, data.workplace.phone))
      .addBeneficiaries(data.beneficiaries);

      await AssociateDb.create(
        { ...associate },
        { include: [
            { model: AssociateDetailDb, as: "detail" },
            { model: AddressDb, as: "address" },
            { model: WorkplaceDb, as: "workplace" }
          ]
        }
      );
    } catch (err: any) {
      return {
        successful: false,
        code: err.include("DOMAIN") ? ErrorCodes.API_CMD_HANDLER_DOMAIN : ErrorCodes.API_CMD_HANDLER_DATABASE,
        message: "Socio no pudo ser creado. Ocurrió falla al guardar en la base de datos.",
        data: err,
        type: "danger"
      } as CommandResponse;
    }

    return { successful: true, message: "Socio fue creado con éxito.", type: 'success' } as CommandResponse;
  }
}

export type { CreateAssociateCommand };
export default CreateAssociateCommandHandler;
