import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { SingleRepositoryProps } from "./SingleRepository";
import { FiStar } from "react-icons/fi";
import { formatDate } from "../utils/formatDate";
import { BsGithub } from "react-icons/bs";
import { motion } from "framer-motion";
import axios from "axios";

const getLangs = async (url: string) => {
  try {
    const resp = await axios(url);
    return resp.data;
  } catch (error) {
    console.log(error);
  }
};

const SingleRepoPage = () => {
  const { repositories } = useSelector((store: RootState) => store.search);
  const { repoId } = useParams();

  const repo = repositories.find((repo: SingleRepositoryProps) => {
    return repo.id == repoId;
  });

  const {
    name,
    stargazers_count,
    pushed_at,
    languages_url,
    description,
    owner: { avatar_url, login, html_url },
  } = repo as SingleRepositoryProps;

  const [languages, setLanguages] = useState({});

  useEffect(() => {
    getLangs(languages_url as string).then((data) => {
      setLanguages(data);
    });
  }, [languages_url]);

  const memoizedFromatDate = useCallback(() => {
    return formatDate(pushed_at);
  }, [repositories]);

  if (!languages) return <h2>Loading</h2>;

  return (
    <motion.div
      className="repo__container"
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="repo-page">
        <Link to="/">
          <button className="repo-page__btn">Back To List</button>
        </Link>
        <div className="repo-page__container">
          <div className="repo-page__left">
            <div className="repo-page__img-wrapper">
              <img src={avatar_url} alt="" />
            </div>
            <h2 className="repo-page__heading">{name}</h2>
            <a
              style={{ display: "inline-block" }}
              target="_blank"
              href={html_url}
            >
              Author: <b>{login}</b>
            </a>
            <span style={{ display: "flex", alignItems: "center" }}>
              <FiStar /> {stargazers_count}
            </span>
            <p className="repo-page__commit">
              <b>Latest commit:</b> <br /> {memoizedFromatDate()}
            </p>
          </div>
          <div className="repo-page__right">
            <h4>Description:</h4>
            <p className="repo-page__desc">
              {description
                ? description
                : "User did not provided any description"}
            </p>
            {Object.entries(languages).length > 0 && (
              <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
                <h4>Languages used:</h4>
                <ul className="repo-page__langs">
                  {Object.keys(languages).map((key) => (
                    <li key={key}>{key}</li>
                  ))}
                </ul>
              </motion.div>
            )}
            <a className="repo-page__git-btn" href={html_url} target="_blank">
              <BsGithub /> View on github
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default SingleRepoPage;
