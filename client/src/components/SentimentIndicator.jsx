import { getSentiment } from "@/utils/helper";
import { useEffect, useState } from "react";
import { CiFaceFrown, CiFaceMeh, CiFaceSmile } from "react-icons/ci";

const SentimentIndicator = ({ comments }) => {
  const [overallSentiment, setOverallSentiment] = useState(0);
  // const [sentimentRatios, setSentimentRatios] = useState([0, 100, 0]);
  const [sentimentCount, setSentimentCount] = useState([0, 0, 0]);
  const [widthText, setWidthText] = useState(["w-[33%]", "w-[34%]", "w-[33%]"]);
  // Comment sentiment calculation
  useEffect(() => {
    if (comments && comments.length > 1) {
      const { overallSentiment, sentiments, commentTexts } =
        getSentiment(comments);
      setOverallSentiment(overallSentiment);
      // console.log(overallSentiment, sentiments, commentTexts);
      const sentimentRatios = getSentimentRatios(sentiments);
      setWidthText(getWidthText(sentimentRatios));
      console.log(widthText);
    }
  }, [comments]);

  const getSentimentRatios = (sentiments) => {
    let negativeCount = 0;
    let neutralCount = 0;
    let positiveCount = 0;

    sentiments.map((sentiment) => {
      const score = sentiment.compound;
      if (score >= 0.05) return positiveCount++;
      if (score > -0.05 && score < 0.05) return neutralCount++;
      if (score <= -0.05) return negativeCount++;
    });

    setSentimentCount([negativeCount, neutralCount, positiveCount]);

    return [
      ((negativeCount / sentiments.length) * 100).toFixed(),
      ((neutralCount / sentiments.length) * 100).toFixed(),
      ((positiveCount / sentiments.length) * 100).toFixed(),
    ];
  };

  const getWidthText = (sentimentRatios) => {
    return [
      `${sentimentRatios[0]}%`,
      `${sentimentRatios[1]}%`,
      `${sentimentRatios[2]}%`,
    ];
  };

  // Determine sentiment label and color based on overallSentiment
  const getSentimentLabel = (score) => {
    if (score >= 0.6) return "Overwhelmingly Positive";
    if (score >= 0.35) return "Very Positive";
    if (score >= 0.05) return "Slightly Positive";
    if (score > -0.05 && score < 0.05) return "Neutral";
    if (score <= -0.6) return "Overwhelmingly Negative";
    if (score <= -0.35) return "Very Negative";
    if (score <= -0.05) return "Slightly Negative";
    return "Unknown";
  };

  // const getSentimentColor = (score) => {
  //   if (score >= 0.05) return "bg-green-500"; // Positive
  //   if (score > -0.05 && score < 0.05) return "bg-gray-500"; // Neutral
  //   if (score <= -0.05) return "bg-red-500"; // Negative
  //   return "bg-gray-300"; // Unknown
  // };

  return (
    <div
      className={`pl-2 text-xs flex xs:items-center font-quicksand flex-col xs:flex-row`}
    >
      <div className="mr-1">
        <h2 className="uppercase text-xs sm:text-sm font-semibold text-slate-400">
          Community Sentiment
        </h2>
        <p className="text-sm sm:text-base font-semibold">
          {getSentimentLabel(overallSentiment)}
        </p>
      </div>
      <div>
        <div className="flex gap-1 w-40 h-3">
          {widthText[0] !== "0%" && (
            <div
              style={{ width: widthText[0] }}
              className={`bg-red-500 rounded-sm`}
            ></div>
          )}
          {widthText[1] !== "0%" && (
            <div
              style={{ width: widthText[1] }}
              className={`bg-yellow-500 rounded-sm`}
            ></div>
          )}
          {widthText[2] !== "0%" && (
            <div
              style={{ width: widthText[2] }}
              className={`bg-green-500 rounded-sm`}
            ></div>
          )}
        </div>
        <div className="flex justify-between">
          <div className="flex gap-1 mt-1 items-center">
            <CiFaceFrown className="text-xl text-red-500" />
            {sentimentCount[0]}
          </div>
          <div className="flex gap-1 mt-1 items-center">
            <CiFaceMeh className="text-xl text-yellow-500" />
            {sentimentCount[1]}
          </div>
          <div className="flex gap-1 mt-1 items-center">
            <CiFaceSmile className="text-xl text-green-500" />
            {sentimentCount[2]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentIndicator;
