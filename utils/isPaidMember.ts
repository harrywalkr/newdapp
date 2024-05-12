//FIXME: must do more than just this simple check. should be connected with some api
export function isPaidMember() {
  const key = localStorage.getItem("KEY");
  if (!key) return false;
  return true;
}
