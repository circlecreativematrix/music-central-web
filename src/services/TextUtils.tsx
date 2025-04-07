export function addBrToDescription(description: string) {
    const lines = description.split('\n');
    return  lines.map((line, index) => (
        <span key={index}>
            {line}
            <br />
        </span>
    ));

}