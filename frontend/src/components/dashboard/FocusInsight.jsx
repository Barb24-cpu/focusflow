import { Link } from "react-router-dom";
import { Timer } from "lucide-react";

function FocusInsight({
    eyebrow = "one thing at a time",
    title = "Make space for deep work.",
    message = "Turn a task into 25 minutes of progress. Your next focus session starts here.",
    ctalabel = "Open focus timer",
    to = "/focus",
})