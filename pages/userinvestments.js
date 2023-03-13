import UserInvestments from "@/components/UserInvestments";

const styles = {
  container: `max-w-7xl flex-1`,
  postsList: `flex flex-col gap-3 p-2 sm:grid-cols-2 md:gap-6 md:p-6 lg:grid-cols-3`,
  main: `flex justify-center`,
  wrapper: `w-screen flex mx-auto my-[1rem]`,
  swapPoolsContainer: `flex justify-center h-screen flex-[2] flex justify-items-center justify-center p-[1rem] border-r border-[#50D890]`,
  swapTokensContainer: `flex justify-center h-screen flex-[1] flex flex-grow justify-items-center justify-center p-[1rem]`,
};

export default function UserInvestmentsFn() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.swapPoolsContainer}>
        <UserInvestments />
      </div>
    </div>
  );
}
