import {
  IconBabyCarriage,
  IconSteeringWheel,
  IconUserPlus,
  IconWorld,
} from "@tabler/icons-react";

export type AddonIconId =
  | "additionalDriver"
  | "childSeat"
  | "borderCrossing"
  | "driverService";

type Props = { id: AddonIconId };

const ICONS = {
  additionalDriver: IconUserPlus,
  childSeat: IconBabyCarriage,
  borderCrossing: IconWorld,
  driverService: IconSteeringWheel,
};

/** Semantic Tabler SVG icons for the rental add-ons list. */
export default function AddonIcon({ id }: Props) {
  const Icon = ICONS[id];
  return <Icon aria-hidden="true" size={24} stroke={1.8} />;
}
