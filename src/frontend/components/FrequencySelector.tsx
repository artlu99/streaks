import { FrequencyOption } from "~/constants";
import { useLocalStorageZustand } from "~/hooks/use-zustand";

export const FrequencySelector = () => {
	const { frequency, setFrequency } = useLocalStorageZustand();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFrequency(e.target.checked ? FrequencyOption.DAILY : FrequencyOption.SPORADIC);
	};

	return (
		<div className="flex gap-2">
            <label htmlFor="frequency">{frequency}</label>
			<input
				type="checkbox"
				defaultChecked={true}
				className="toggle"
				name="frequency"
				value={FrequencyOption.DAILY}
				onChange={handleChange}
			/>
		</div>
	);
};
