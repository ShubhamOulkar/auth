import { Schema } from "../form validation/formSchema";

export async function action(previousState: any, formData: FormData) {
  const submitCount = previousState.submitCount + 1;
  const data = {
    name: formData.get("name")?.toString() || "",
    age: Number(formData.get("age")?.toString()) || 0,
  };

  console.log("action data:", data);

  const validate = Schema.safeParse(data);

  if (validate.success) {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 3000);
    });
    return {
      success: true,
      data: { name: "", age: 0 },
      submitCount: 0,
      actionError: undefined,
    };
  }

  return {
    success: false,
    data: data,
    submitCount,
    actionError: validate.error.flatten().fieldErrors,
  };
}
