// import { useActionState, Profiler } from "react";
// import { action } from "../../form action/action";
// // import { Input } from "../from fields/Input";
// import { onRender } from "../../onRenderProfile";

// export function UseActionStateForm() {
//   const initialState = {
//     success: false,
//     data: {
//       name: "",
//       age: 0,
//     },
//     submitCount: 0,
//     actionError: undefined,
//   };

//   // const [state, formAction, isPending] = useActionState(action, initialState);

//   console.count("useActionForm render count");
//   return (
//     <>
//       <h1>useActionState Form</h1>
//       <Profiler id="UseActionStateForm" onRender={onRender}>
//         <form>
//           {/* <Input
//             type="text"
//             name="name"
//             error={state.actionError?.name && state.actionError.name[0]}
//             submitCount={state.submitCount}
//             submittedSuccessfully={state.success}
//             defaultValue={state.data.name}
//           />
//           <Input
//             type="number"
//             name="age"
//             error={state.actionError?.age && state.actionError.age[0]}
//             submitCount={state.submitCount}
//             submittedSuccessfully={state.success}
//             defaultValue={state.data.age}
//           /> */}
//           <button>{isPending ? "submitting..." : "submit"}</button>
//         </form>
//       </Profiler>
//     </>
//   );
// }
