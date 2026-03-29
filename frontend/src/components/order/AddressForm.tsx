import { Input } from "@/components/ui/input";
import { useState } from "react";
import { addAddressAction } from "@/api/actions.ts";
import { type FormEvent } from "react";
import { type Address } from "@/lib/types.ts";

import { useUser } from "@/store/UserContext.tsx";

interface Props {
  address: Address | null | undefined;
}

const AddressForm = ({ address }: Props) => {
  const [street, setStreet] = useState<string>(
    address?.street ? address.street : "",
  );
  const [city, setCity] = useState<string>(address?.city ? address.city : "");
  const [state, setState] = useState<string>(
    address?.state ? address.state : "",
  );
  const [phone, setPhone] = useState<string>(
    address?.phone ? address.phone : "",
  );

  const [btnLoader, setBtnLoader] = useState<boolean>(false);

  const { user } = useUser();
  const email = typeof user === "undefined" ? "" : user.email;

  const disableButtonHandler = () => {
    if (
      street.trim().length == 0 ||
      city.trim().length == 0 ||
      state.trim().length == 0 ||
      phone.trim().length == 0
    ) {
      return true;
    } else {
      return false;
    }
  };

  const addAddressHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBtnLoader(true);

    const addressData = { email, street, city, state, phone };

    addAddressAction(addressData);

    setStreet("");
    setCity("");
    setState("");
    setPhone("");

    // setBtnLoader(false);

    // -- delay to watch button disable --
    const reloadDelay = () => {
      setBtnLoader(false);
      window.location.reload();
    };
    setTimeout(reloadDelay, 3000);
  };

  return (
    <form
      className="w-full mx-auto bg-white p-8 rounded-2xl space-y-6"
      onSubmit={addAddressHandler}
    >
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
        Shipping Address
      </h2>
      <div className="space-y-4">
        <Input
          placeholder="Street Address"
          value={street}
          onChange={(event) => setStreet(event.target.value)}
          className="w-full h-12 px-4 rounded-md border-gray-300
          focus:border-black focus:ring-2 focus:ring-black/20 transition-all"
        />
        <Input
          placeholder="City"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          className="w-full h-12 px-4 rounded-md border-gray-300
          focus:border-black focus:ring-2 focus:ring-black/20 transition-all"
        />
        <Input
          placeholder="State"
          value={state}
          onChange={(event) => setState(event.target.value)}
          className="w-full h-12 px-4 rounded-md border-gray-300
          focus:border-black focus:ring-2 focus:ring-black/20 transition-all"
        />
        <Input
          placeholder="Phone Number"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="w-full h-12 px-4 rounded-md border-gray-300
          focus:border-black focus:ring-2 focus:ring-black/20 transition-all"
        />
      </div>
      <button
        type="submit"
        disabled={disableButtonHandler() || btnLoader}
        className="w-full h-12 bg-black text-white font-medium rounded-md
				hover:bg-gray-800 transition-all duration-300 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {btnLoader
          ? "Saving Address..."
          : address?.city
            ? "Update Address"
            : "Save Address"}
      </button>
    </form>
  );
};

export default AddressForm;
