import { dailyIcons, FrequencyOption, sporadicIcons } from "~/constants";

export const getIconsForFrequency = (frequency: string) => {
    if (frequency === FrequencyOption.DAILY) {
        return dailyIcons;
    }
    return sporadicIcons;
};