export function ResearchProfileLinks({ orcid }: { orcid: string }) {
  return <div className="research-profile-links">
    <a className="ds-link" href={`https://orcid.org/${orcid}`}>ORCID <span>{orcid} ↗</span></a>
    <a className="ds-link" href="https://scholar.google.com/citations?user=nI-QsCMAAAAJ">Google Scholar <span aria-hidden="true">↗</span></a>
  </div>;
}
