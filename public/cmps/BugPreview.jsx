export function BugPreview({ bug }) {
  return (
    <article className="bug-preview">
      <h2>Bug Title: {bug.title}</h2>
      <h4>Description: {bug.description}</h4>
      {bug.owner && <h4>Bug Creator:{bug.owner.fullname}</h4>}
      <h4>Severity: {bug.minSeverity}</h4>
      <h1>🐛</h1>
      {/* <img src={`../assets/img/audu.png`} alt="" /> */}
    </article>
  )
}
