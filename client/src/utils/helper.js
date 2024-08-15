import { formatDistanceToNow, format } from "date-fns";
import { enqueueSnackbar } from "notistack";
import vader from "vader-sentiment";

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

const getSentiment = (comments) => {
  const commentTexts = []
  const sentiments = []

  comments.map((comment) => {
    commentTexts.push(comment.content)

    const input = comment.content || " ";
    const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(input);

    sentiments.push(intensity)
    // console.log(comment.content, intensity);
  })

  const overallSentiment = sentiments.reduce((sum, curr) => sum + curr.compound, 0) / sentiments.length

  return { overallSentiment, sentiments, commentTexts }
  // {neg: 0.0, neu: 0.299, pos: 0.701, compound: 0.8545}
}

export { formatDate, formatDateToNow, publicIdFromCloudinaryUrl, cookingToast, getSentiment }