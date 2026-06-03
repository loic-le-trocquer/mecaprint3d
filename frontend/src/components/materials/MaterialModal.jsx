import MaterialProductSheet from "./MaterialProductSheet";

export default function MaterialModal({
  material,
  onClose,
}) {
  return (
    <MaterialProductSheet
      material={material}
      onClose={onClose}
    />
  );
}