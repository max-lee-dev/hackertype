export default function StoredInput() {
  function setCode(array, idx, value) {
    const newArray = [...array];
    newArray[idx] = value;
    return newArray;
  }

  function getCode(array, idx) {
    return array[idx];
  }
  return {
    setCode: setCode,
    getCode: getCode,
  };
}
