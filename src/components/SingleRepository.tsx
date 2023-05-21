import { FiStar } from "react-icons/fi";
import { BsGithub } from "react-icons/bs";
import { formatDate } from "../utils/formatDate";
import { Link } from "react-router-dom";
import { useCallback } from "react";
import { motion } from "framer-motion";

export type SingleRepositoryProps = {
  name: string;
  id: string;
  stargazers_count: string;
  pushed_at: string;
  description?: string;
  languages_url?: string;
  html_url: string;
  owner: { avatar_url: string; login: string; html_url: string };
};

const SingleRepository = ({
  name,
  id,
  stargazers_count,
  pushed_at,
  html_url,
  owner: { avatar_url: img },
}: SingleRepositoryProps) => {
  const memoizedFromatDate = useCallback(() => {
    return formatDate(pushed_at);
  }, [pushed_at]);

  return (
    <motion.div
      className="single-repo"
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="single-repo__wrapper">
        <img src={img} alt={img} />
      </div>
      <Link to={`/${id}`}>
        <h4 className="single-repo__heading">{name}</h4>
      </Link>
      <span style={{ display: "flex", alignItems: "center" }}>
        <FiStar /> {stargazers_count}
      </span>
      <p className="single-repo__desc">
        <b>Latest commit:</b> <br /> {memoizedFromatDate()}
      </p>
      <a className="single-repo__git-btn" href={html_url} target="_blank">
        <BsGithub /> View on github
      </a>
    </motion.div>
  );
};
export default SingleRepository;
