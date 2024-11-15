import { BooleanObject } from "../types/types";

interface TopicSelectProps {
  topics: BooleanObject;
  setTopics: React.Dispatch<React.SetStateAction<BooleanObject>>;
}

export const TopicSelect = ({ topics, setTopics }: TopicSelectProps) => {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setTopics(prevTopics => ({
      ...prevTopics,
      [name]: checked
    }));
  }

  return (
    <fieldset id="topic-fieldset">
      <legend>Select topics to subscribe to:</legend>
      {Object.keys(topics).map(topic => {
        return (
          <label className="topic-label" key={topic}>
          <input onChange={handleCheckboxChange} type="checkbox" name={topic} checked={topics[topic]}/>{topic}
          </label>
        )
      })}
    </fieldset>
  )
}
