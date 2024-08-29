import { useState } from "react";
import { HandCash } from "iconoir-react";
import TooltipElement from "../../../../components/elements/tooltip-element";
import ContributionCreateModal from "../modals/contribution-create-modal";

type ContributionCreateActionButtonParams = {
  savingFundId: number;
  onClose: () => void;
};

export default function ContributionCreateActionButton({ savingFundId, onClose }: ContributionCreateActionButtonParams) {
  const [showModal, setShowModal] = useState(false);
  const [selectedSavingFund, setSelectedSavingFund] = useState<number>(0);

  const handleClick = (savingFundId: number, show: boolean) => {
    setSelectedSavingFund(savingFundId);
    setShowModal(show);

    if (onClose) onClose();
  }

  return (
    <>
    <button title="Abonar" 
      data-tooltip-id="contribution-tooltip" 
      onClick={() => handleClick(savingFundId, true)}>
      <HandCash />
      <TooltipElement id="contribution-tooltip" text="Abonar" />
    </button>
    <ContributionCreateModal savingFundId={selectedSavingFund} show={showModal} onClose={() => handleClick(0, false)} />
    </>
  )
}

export type { ContributionCreateActionButtonParams };