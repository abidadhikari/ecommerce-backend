export function getName(fName: String, mName: String, lName: String) {
  const name = `${fName}${mName ? " " + mName : ""}${lName ? " " + lName : ""}`;
  return name;
}
