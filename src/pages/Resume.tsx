const pdfUrl = '/resume.pdf';

export function Resume() {
  return (
    <section className="h-screen w-full bg-white">
      <iframe title="Lifuyue Resume" src={pdfUrl} className="block h-full w-full bg-white" />
    </section>
  );
}
