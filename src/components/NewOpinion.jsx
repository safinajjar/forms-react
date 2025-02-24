import { use, useActionState } from "react";
import { OpinionsContext } from "../store/opinions-context";
import Submit from "./Submit";

export function NewOpinion() {
  const { addOpinion } = use(OpinionsContext);

  const [formState, formAction] = useActionState(shareOpinionAction, {
    errors: null,
  });

  async function shareOpinionAction(_prevState, formData) {
    const { title, userName, body } = Object.fromEntries(formData.entries());

    let errors = [];

    if (title.trim().length < 5) {
      errors.push("Title must be at least 5 characters long.");
    }

    if (!userName) {
      errors.push("User name is required.");
    }

    if (body.trim().length < 10 || body.trim().length > 300) {
      errors.push("Opinion body must be between 10 and 300 characters long.");
    }

    if (errors.length > 0) {
      return {
        errors,
        enteredValues: { title, userName, body },
      };
    }

    // submit to backend
    await addOpinion({
      title,
      userName,
      body,
    });

    return {
      errors: [],
    };
  }

  return (
    <div id="new-opinion">
      <h2>Share your opinion!</h2>
      <form action={formAction}>
        <div className="control-row">
          <p className="control">
            <label htmlFor="userName">Your Name</label>
            <input
              type="text"
              id="userName"
              name="userName"
              defaultValue={formState.enteredValues?.userName}
            />
          </p>

          <p className="control">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              defaultChecked={formState.enteredValues?.title}
            />
          </p>
        </div>
        <p className="control">
          <label htmlFor="body">Your Opinion</label>
          <textarea
            id="body"
            name="body"
            rows={5}
            defaultChecked={formState.enteredValues?.body}
          ></textarea>
        </p>

        {formState.errors && (
          <ul className="errors">
            {formState.errors.map((error) => {
              return <li key={error}>{error}</li>;
            })}
          </ul>
        )}

        <Submit />
      </form>
    </div>
  );
}
