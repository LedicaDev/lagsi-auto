import Swal from "sweetalert2";

export const confirmDelete = async (
  msg = "¿Seguro que deseas eliminar este registro?"
) => {
  return await Swal.fire({
    title: "Confirmar eliminación",
    text: msg,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });
};

export const successAlert = (msg = "Operación realizada con éxito") => {
  Swal.fire({
    icon: "success",
    title: "Éxito",
    text: msg,
    timer: 2000,
    showConfirmButton: false,
  });
};

export const errorAlert = (msg = "Ooops! Ocurrió un error inesperado") => {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: msg,
  });
};
