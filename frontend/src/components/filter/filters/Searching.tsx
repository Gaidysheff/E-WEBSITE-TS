import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";

import { Search } from "lucide-react";

interface Props {
  search: any;
}

const Searching = ({ search }: Props) => {
  return (
    <>
      <div className="font-semibold my-2">Search</div>
      <InputGroup className="my-2">
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupText>0 results</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </>
  );
};

export default Searching;
