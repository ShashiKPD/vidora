import { formatDistanceToNow, format } from "date-fns";
import { enqueueSnackbar } from "notistack";

const formatDateToNow = (createdAt) => formatDistanceToNow(new Date(createdAt), {
  addSuffix: true,
});

const formatDate = (createdAt) => format(new Date(createdAt), 'MMMM dd, yyyy');

function publicIdFromCloudinaryUrl(url) {
  if (!url) return null;
  const urlParts = url.split('/')

  if (urlParts.length < 1) return null

  const lastPart = urlParts[urlParts.length - 1]
  const publicId = lastPart.split('.')?.[0]

  return publicId
}

const cookingToast = (message = "This functionality is cooking 🍚") => {
  enqueueSnackbar(message, { variant: 'normal' });
}

export { formatDate, formatDateToNow, publicIdFromCloudinaryUrl, cookingToast }