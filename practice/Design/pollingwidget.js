// ******requirement*****

// Component 1 -
//  List of voting elements []
// each element will have -
//  - percentage (after vote)
//  - total votes (after vote)
//  - name of element

// Submit Button?  -- will make each element as clickable to submit the post
// Get the latest result in the post call upon submission, in order to show overall results
// RBAC Plan

// RADIO

const response = {
  status: "success",
  message: "poll has been created success full",
  polls: {
    txId: uuid(),
    total: 230,
    question: "Which is your favourite Javascript lib/framework",
    last_updated: new Date(),
    options: [
      {
        id: uuid(),
        name: "React Framework",
        vote: 80,
        userVotedForOption: false,
      },
      {
        id: uuid(),
        name: "Angular Framework",
        vote: 30,
        userVotedForOption: true,
      },
      {
        id: uuid(),
        name: "Vue Framework",
        vote: 20,
        userVotedForOption: true,
      },
    ],
  },
};
