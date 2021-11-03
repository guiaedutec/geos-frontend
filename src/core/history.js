import createBrowserHistory from "history/lib/createBrowserHistory";
import useQueries from "history/lib/useQueries";

const history = useQueries(createBrowserHistory)();

export default history;
