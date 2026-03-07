/**
 * @template T
 * @param {() => Promise<T>} fn
 * @param {import("react").DependencyList} deps
 */
export default function useQuery(fn, deps = []) {
  // const cache={};
  let status = { pending: "loading", rejected: "error", fullfilled: "success" };

  return new Promise((resolve, reject) => {
    fn.then((data) => resolve({ status: status[fullfilled], data })).catch(
      (error) => {},
    );
  });
}
