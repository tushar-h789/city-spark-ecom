import BoilerIcon from "@/components/icons/boiler";
import RadiatorIcon from "@/components/icons/radiator";
import HeatingIcon from "@/components/icons/heating";
import PlumbingIcon from "@/components/icons/plumbing";
import BathroomIcon from "@/components/icons/bathroom";
import KitchenTilesIcon from "@/components/icons/kitchen-tiles";
import SparesIcon from "@/components/icons/spares";
import RenewablesIcon from "@/components/icons/renewables";
import ToolsIcon from "@/components/icons/tools";
import ElectricalIcon from "@/components/icons/electrical";

export const timelineData = [
  {
    id: 1,
    title: "First event",
    date: "2022-01-01",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Odio euismod lacinia at quis risus sed vulputate odio ut. Quam viverra orci sagittis eu volutpat odio facilisis mauris.",
  },
  {
    id: 2,
    title: "Second event",
    date: "2022-02-01",
    description:
      "Aut eius excepturi ex recusandae eius est minima molestiae. Nam dolores iusto ad fugit reprehenderit hic dolorem quisquam et quia omnis non suscipit nihil sit libero distinctio. Ad dolorem tempora sit nostrum voluptatem qui tempora unde? Sit rerum magnam nam ipsam nesciunt aut rerum necessitatibus est quia esse non magni quae.",
  },
  {
    id: 3,
    title: "Third event",
    date: "2022-03-01",
    description:
      "Sit culpa quas ex nulla animi qui deleniti minus rem placeat mollitia. Et enim doloremque et quia sequi ea dolores voluptatem ea rerum vitae. Aut itaque incidunt est aperiam vero sit explicabo fuga id optio quis et molestiae nulla ex quae quam. Ab eius dolores ab tempora dolorum eos beatae soluta At ullam placeat est incidunt cumque.",
  },
];

export type TimelineData = (typeof timelineData)[number];

export interface TimelineElement {
  id: number;
  title: string;
  date: string;
  description: string;
}

type IconProps = {
  className?: string;
  height?: number | string;
  width?: number | string;
};

export const categoryData: {
  label: string;
  Icon: React.ComponentType<IconProps>;
}[] = [
  { label: "Boilers", Icon: BoilerIcon },
  { label: "Radiators", Icon: RadiatorIcon },
  { label: "Heating", Icon: HeatingIcon },
  { label: "Plumbing", Icon: PlumbingIcon },
  { label: "Bathrooms", Icon: BathroomIcon },
  { label: "Kitchen", Icon: KitchenTilesIcon },
  { label: "Spares", Icon: SparesIcon },
  { label: "Renewables", Icon: RenewablesIcon },
  { label: "Tools", Icon: ToolsIcon },
  { label: "Electrical", Icon: ElectricalIcon },
];

export const statusMap = {
  ACTIVE: {
    label: "Active",
    background: "bg-emerald-500/15",
    indicator: "bg-emerald-500",
    className: "bg-emerald-50 text-emerald-700",
  },
  DRAFT: {
    label: "Draft",
    background: "bg-amber-500/15",
    indicator: "bg-amber-500",
    className: "bg-amber-50 text-amber-700",
  },
  ARCHIVED: {
    label: "Archived",
    background: "bg-gray-500/15",
    indicator: "bg-gray-500",
    className: "bg-gray-50 text-gray-700",
  },
};
