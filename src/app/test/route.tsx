import { renderToReadableStream } from "react-dom/server.edge";

// Try to switch to runtime "nodejs" and see that it works
export const runtime = "edge";

function ExampleComponent() {
	return (
		<div>
			<h1>Server Rendered Content</h1>
		</div>
	);
}

const decoder = new TextDecoder("utf-8");

export async function GET() {

  // Render the component to a readable stream
  // This works with runtime "nodejs" but fails with runtime "edge"
	const stream = await renderToReadableStream(
		<ExampleComponent />,
	);

  // Convert the readable stream to a string
  let result = "";
	// means it's a readable stream
	const writableStream = new WritableStream({
		write(chunk: BufferSource) {
			result += decoder.decode(chunk);
		},
	});
	await stream.pipeTo(writableStream);

  // Log to console
  // A more practical example would be to send the html as an email or save it to a file.
  // See react-mail
  console.log({ result });

	return Response.json({ ok: true });
}
