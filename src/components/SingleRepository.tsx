import { FiStar } from "react-icons/fi";
import { BsGithub } from "react-icons/bs";
import { formatDate } from "../utils/formatDate";
import { Link } from "react-router-dom";

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
  return (
    <div className="single-repo">
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
        <b>Latest commit:</b> <br /> {formatDate(pushed_at)}
      </p>
      <a className="single-repo__git-btn" href={html_url} target="_blank">
        <BsGithub /> View on github
      </a>
    </div>
  );
};
export default SingleRepository;
