// import { Input } from "@/components/ui/input";
// import { addAddressAction } from "@/api/actions.js";
// import { toast } from "react-toastify";
// import { useState } from "react";
// import { useUser } from "@/store/api/UserContext.jsx";

// const AddressForm = ({ address }) => {
//   const [street, setStreet] = useState(address?.street ? address.street : "");
//   const [city, setCity] = useState(address?.city ? address.city : "");
//   const [state, setState] = useState(address?.state ? address.state : "");
//   const [phone, setPhone] = useState(address?.phone ? address.phone : "");

//   const [btnLoader, setBtnLoader] = useState(false);

//   const user = useUser();
//   const email = user[0]?.email;

//   const disableButtonHandler = () => {
//     if (
//       street.trim().length == 0 ||
//       city.trim().length == 0 ||
//       state.trim().length == 0 ||
//       phone.trim().length == 0
//     ) {
//       return true;
//     } else {
//       return false;
//     }
//   };

//   const addAddressHandler = async (event) => {
//     event.preventDefault();
//     setBtnLoader(true);
//     const addressData = { email, street, city, state, phone };

//     try {
//       await addAddressAction(addressData);
//       toast.success("Your shipping address has been saved!");

//       setStreet("");
//       setCity("");
//       setState("");
//       setPhone("");

//       // -------- Delay for showing toaster ------------
//       const reloadDelay = () => {
//         window.location.reload();
//       };
//       setTimeout(reloadDelay, 3000);
//     } catch (error) {
//       if (error instanceof Error) {
//         toast.error(error.message);
//         throw new Error(error.message);
//       }
//       toast.error("An unknown error occured");
//       throw new Error("An unknown error occured");
//     } finally {
//       setBtnLoader(false);
//     }
//   };

//   return (
//     <form
//       className="w-full mx-auto bg-white p-8 rounded-2xl space-y-6"
//       onSubmit={addAddressHandler}
//     >
//       <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
//         Shipping Address
//       </h2>
//       <div className="space-y-4">
//         <Input
//           placeholder="Street Address"
//           value={street}
//           onChange={(event) => setStreet(event.target.value)}
//           className="w-full h-12 px-4 rounded-md border-gray-300
//           focus:border-black focus:ring-2 focus:ring-black/20 transition-all"
//         />
//         <Input
//           placeholder="City"
//           value={city}
//           onChange={(event) => setCity(event.target.value)}
//           className="w-full h-12 px-4 rounded-md border-gray-300
//           focus:border-black focus:ring-2 focus:ring-black/20 transition-all"
//         />
//         <Input
//           placeholder="State"
//           value={state}
//           onChange={(event) => setState(event.target.value)}
//           className="w-full h-12 px-4 rounded-md border-gray-300
//           focus:border-black focus:ring-2 focus:ring-black/20 transition-all"
//         />
//         <Input
//           placeholder="Phone Number"
//           value={phone}
//           onChange={(event) => setPhone(event.target.value)}
//           className="w-full h-12 px-4 rounded-md border-gray-300
//           focus:border-black focus:ring-2 focus:ring-black/20 transition-all"
//         />
//       </div>
//       <button
//         type="submit"
//         disabled={disableButtonHandler() || btnLoader}
//         className="w-full h-12 bg-black text-white font-medium rounded-md
// 				hover:bg-gray-800 transition-all duration-300 cursor-pointer
//         disabled:opacity-50 disabled:cursor-not-allowed"
//       >
//         {btnLoader
//           ? "Saving Address..."
//           : address?.city
//             ? "Update Address"
//             : "Save Address"}
//       </button>
//     </form>
//   );
// };

// export default AddressForm;
