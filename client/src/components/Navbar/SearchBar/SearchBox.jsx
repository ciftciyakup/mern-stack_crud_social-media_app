import { ClickAwayListener } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { searchIcon } from "../SvgIcons";
import SearchUserItem from "./SearchUserItem";

const SearchBox = ({ params }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(false);
  const [searching, setSearching] = useState(false);

  const fetchUsers = async (term) => {
    setLoading(true);
    const { data } = await axios.get(`/users?keyword=${term}`, { params });
    setUsers(data.users);
    setLoading(false);
  };

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      fetchUsers(searchTerm);
    }

    return () => {
      setUsers([]);
    };
  }, [searchTerm]);

  const handleClickAway = () => {
    setSearchTerm("");
    setSearchResult(false);
    setSearching(false);
  };

  const handleFocus = () => {
    setSearchResult(true);
    setSearching(true);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div
        className={`flex items-center gap-3 pl-4 max-sm:mb-1 ${
          params
            ? ""
            : "ml-36 mr-6 max-[960px]:ml-6 max-[600px]:mb-2 max-[600px]:mt-1 max-[600px]:flex-grow"
        } w-64 py-2 bg-[#efefef] rounded-lg relative`}
      >
        {!searching && searchIcon}
        <input
          className="bg-transparent text-sm border-none outline-none flex-1 pr-3"
          type="search"
          value={searchTerm}
          onFocus={handleFocus}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Ara"
        />
        {searchResult && (
          <>
            <div
              className="absolute right-1/2 -bottom-5 rotate-45 h-4 w-4
            drop-shadow-lg bg-white rounded-sm border-l border-t"
            ></div>

            <div
              className={`${
                loading
                  ? "justify-center items-center"
                  : users.length < 1 && "justify-center items-center"
              } absolute overflow-y-auto overflow-x-hidden flex flex-col
              top-[49px] w-[23rem] max-[425px]:w-[90vw] -left-11
              max-[425px]:left-1/2 max-[425px]:translate-x-[-50%] h-80 bg-white
              drop-shadow-xl rounded ${params ? "z-10" : ""}`}
            >
              {loading ? (
                <svg
                  aria-label="Yükleniyor..."
                  className="h-6 w-6 my-2 animate-spin"
                  viewBox="0 0 100 100"
                >
                  <rect
                    fill="#555555"
                    height="6"
                    opacity="0"
                    rx="3"
                    ry="3"
                    transform="rotate(-90 50 50)"
                    width="25"
                    x="72"
                    y="47"
                  ></rect>
                  <rect
                    fill="#555555"
                    height="6"
                    opacity="0.08333333333333333"
                    rx="3"
                    ry="3"
                    transform="rotate(-60 50 50)"
                    width="25"
                    x="72"
                    y="47"
                  ></rect>
                  <rect
                    fill="#555555"
                    height="6"
                    opacity="0.16666666666666666"
                    rx="3"
                    ry="3"
                    transform="rotate(-30 50 50)"
                    width="25"
                    x="72"
                    y="47"
                  ></rect>
                  <rect
                    fill="#555555"
                    height="6"
                    opacity="0.25"
                    rx="3"
                    ry="3"
                    transform="rotate(0 50 50)"
                    width="25"
                    x="72"
                    y="47"
                  ></rect>
                  <rect
                    fill="#555555"
                    height="6"
                    opacity="0.3333333333333333"
                    rx="3"
                    ry="3"
                    transform="rotate(30 50 50)"
                    width="25"
                    x="72"
                    y="47"
                  ></rect>
                  <rect
                    fill="#555555"
                    height="6"
                    opacity="0.4166666666666667"
                    rx="3"
                    ry="3"
                    transform="rotate(60 50 50)"
                    width="25"
                    x="72"
                    y="47"
                  ></rect>
                  <rect
                    fill="#555555"
                    height="6"
                    opacity="0.5"
                    rx="3"
                    ry="3"
                    transform="rotate(90 50 50)"
                    width="25"
                    x="72"
                    y="47"
                  ></rect>
                  <rect
                    fill="#555555"
                    height="6"
                    opacity="0.5833333333333334"
                    rx="3"
                    ry="3"
                    transform="rotate(120 50 50)"
                    width="25"
                    x="72"
                    y="47"
                  ></rect>
                  <rect
                    fill="#555555"
                    height="6"
                    opacity="0.6666666666666666"
                    rx="3"
                    ry="3"
                    transform="rotate(150 50 50)"
                    width="25"
                    x="72"
                    y="47"
                  ></rect>
                  <rect
                    fill="#555555"
                    height="6"
                    opacity="0.75"
                    rx="3"
                    ry="3"
                    transform="rotate(180 50 50)"
                    width="25"
                    x="72"
                    y="47"
                  ></rect>
                  <rect
                    fill="#555555"
                    height="6"
                    opacity="0.8333333333333334"
                    rx="3"
                    ry="3"
                    transform="rotate(210 50 50)"
                    width="25"
                    x="72"
                    y="47"
                  ></rect>
                  <rect
                    fill="#555555"
                    height="6"
                    opacity="0.9166666666666666"
                    rx="3"
                    ry="3"
                    transform="rotate(240 50 50)"
                    width="25"
                    x="72"
                    y="47"
                  ></rect>
                </svg>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <SearchUserItem params={params} {...user} key={user._id} />
                ))
              ) : (
                <span className="text-gray-400 text-sm">Sonuç bulunamadı.</span>
              )}
            </div>
          </>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default SearchBox;
