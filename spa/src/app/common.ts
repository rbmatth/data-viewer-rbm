export function toTitleCase(title: string) {
  var words = title.split(' ');
  var output = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
  })
  return output.join(' ');
}
