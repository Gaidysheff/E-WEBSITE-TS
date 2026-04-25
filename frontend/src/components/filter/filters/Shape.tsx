import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  handleShapeChange: (value: string) => void;
  currentShape: string | undefined;
  options: { value: string; label: string }[];
}

const Shape = ({ handleShapeChange, currentShape, options }: Props) => {
  return (
    <>
      <div className="font-semibold my-2">Shape</div>

      <Select onValueChange={handleShapeChange} value={currentShape || ""}>
        <SelectTrigger className="w-[180px] focus:border-myMainColor/50">
          <SelectValue placeholder="show all shapes" />
        </SelectTrigger>
        <SelectContent className="border-2 border-myMainColor/50">
          <SelectGroup>
            <SelectItem
              value="all"
              className="focus:bg-myMainColor/50 focus:font-bold"
            >
              All shapes
            </SelectItem>

            {options?.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="focus:bg-myMainColor/50 focus:font-bold"
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
};

export default Shape;
