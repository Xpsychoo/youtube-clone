import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { IoClose, IoSearch } from 'react-icons/io5';
import { MdHistory } from 'react-icons/md';

import { useApi, useDebounce } from '../../Utils/hooks';

const RECENT_KEY = 'recentSearches';

const readRecent = () => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
  } catch (e) {
    return [];
  }
};

const saveRecent = (list) => {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch (e) {
    // Recent searches are a convenience; ignore storage failures.
  }
};

const SearchBar = ({ autoFocus, onClose }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const inputRef = useRef(null);

  const currentQuery = pathname.startsWith('/search/') ? decodeURIComponent(pathname.slice('/search/'.length)) : '';
  const [text, setText] = useState(currentQuery);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recent, setRecent] = useState(readRecent);
  const [suggestions, setSuggestions] = useState([]);

  const query = useDebounce(text.trim(), 300);
  const { data } = useApi(isOpen && query.length >= 2 ? `auto-complete/?q=${encodeURIComponent(query)}` : null);

  useEffect(() => {
    setText(currentQuery);
  }, [currentQuery]);

  useEffect(() => {
    if (data?.results) setSuggestions(data.results.filter((item) => typeof item === 'string').slice(0, 8));
  }, [data]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const showingRecent = !text.trim();
  const options = showingRecent ? recent : suggestions;

  const submit = (value) => {
    const q = value.trim();
    if (!q) return;
    const nextRecent = [q, ...recent.filter((item) => item !== q)].slice(0, 8);
    setRecent(nextRecent);
    saveRecent(nextRecent);
    setText(q);
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.blur();
    navigate(`/search/${encodeURIComponent(q)}`);
    onClose?.();
  };

  const removeRecent = (item) => {
    const nextRecent = recent.filter((r) => r !== item);
    setRecent(nextRecent);
    saveRecent(nextRecent);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      setActiveIndex((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <form
      className="search-bar"
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        submit(activeIndex >= 0 && options[activeIndex] ? options[activeIndex] : text);
      }}
    >
      <button type="button" className="icon-btn search-bar__back" onClick={onClose} aria-label="Close search">
        <FiArrowLeft />
      </button>

      <div className="search-bar__field">
        <IoSearch className="search-bar__icon" />
        <input
          ref={inputRef}
          value={text}
          placeholder="Search"
          aria-label="Search"
          autoComplete="off"
          onChange={(e) => {
            setText(e.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          onKeyDown={handleKeyDown}
        />
        {text && (
          <button
            type="button"
            className="icon-btn icon-btn--sm search-bar__clear"
            aria-label="Clear search"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setText('');
              inputRef.current?.focus();
            }}
          >
            <IoClose />
          </button>
        )}

        {isOpen && options.length > 0 && (
          <ul className="search-bar__suggestions" role="listbox">
            {showingRecent && <li className="search-bar__heading">Recent searches</li>}
            {options.map((option, i) => (
              <li
                key={option}
                role="option"
                aria-selected={i === activeIndex}
                className={i === activeIndex ? 'is-active' : ''}
                onMouseDown={(e) => {
                  // Keep focus in the input so onBlur doesn't close the list before the click lands.
                  e.preventDefault();
                  submit(option);
                }}
              >
                {showingRecent ? <MdHistory /> : <IoSearch />}
                <span>{option}</span>
                {showingRecent && (
                  <button
                    type="button"
                    className="search-bar__remove"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeRecent(option);
                    }}
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button type="submit" className="search-bar__submit" aria-label="Search">
        <IoSearch />
      </button>
    </form>
  );
};

export default SearchBar;
