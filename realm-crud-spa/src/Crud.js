export default function Crud({context, setMainContent, inclusions=["Create"]}) {
  return (
    <div>
      {inclusions.map((verb) => {return <button key={context + verb} onClick={() => {setMainContent({ page: context + verb, params: {} })}}>{verb + " " + context}</button>})}
    </div>
  );
}
