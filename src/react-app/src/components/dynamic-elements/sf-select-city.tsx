import { memo, useEffect } from "react"
import { SFNumberInputInfo } from "../form/interfaces/sf-input-info";
import CityInfo from "../../core/interfaces/city-info";
import CommandResponseInfo from "../../core/interfaces/command-response-info";
import useCacheStore from "../../core/stores/cache-store";
import AppConstants from "../../core/constants/app-constants";

interface SFSelectCityProps extends SFNumberInputInfo {
  stateId: number;
}

const SFSelectCity = memo(({ id, name, value, stateId, onChange }: SFSelectCityProps) => {
  const { cities, setCities } = useCacheStore();

  useEffect(() => {
    const fetchCities = async () => {
      const result = await fetch(AppConstants.apiCity, {
        method: 'GET'
      });

      const response = await result.json() as CommandResponseInfo;
      const cities = JSON.parse(response.data!) as CityInfo[];

      setCities(cities);

      console.log("Cities loaded...");
    };

    if (cities.length <= 0) fetchCities();
  }, []);

  return (
    <div className="field">
      <label htmlFor={id} className="label">{name}</label>
      <div className="select" style={{display: "grid"}}>
      <select id={id} value={value} onChange={(e) => onChange ? onChange(parseInt(e.target.value)) : undefined}>
        <option value={0}>---</option>
        {cities.filter((city: CityInfo) => city.stateId == stateId).map((option: CityInfo) => [
          <option key={option.id} value={option.id}>{option.name}</option>
        ])}
        </select>
      </div>
    </div>
  )
});

export default SFSelectCity;