function Node(iValue, oLeft, oRight) {
  this.value = iValue;
  this.left = oLeft;
  this.right = oRight;
}

var BST = {
  root: undefined,
  insert: function (iValue) {
    if (this.root === undefined) {
      this.root = new Node(iValue);
      return true;
    }
    let oNodeBefore = undefined;
    let oCurrentNode = this.root;
    while (oCurrentNode !== undefined) {
      oNodeBefore = oCurrentNode;
      if (oCurrentNode.value < iValue) {
        oCurrentNode = oCurrentNode.right;
      } else if (oCurrentNode.value > iValue) {
        oCurrentNode = oCurrentNode.left;
      } else {
        return false;
      }
    }

    if (oNodeBefore.value < iValue) {
      oNodeBefore.right = new Node(iValue);
    } else {
      oNodeBefore.left = new Node(iValue);
    }
    return true;
  },
  search: function (iValue) {
    let oCurrentNode = this.root;
    while (oCurrentNode !== undefined) {
      if (oCurrentNode.value < iValue) {
        oCurrentNode = oCurrentNode.right;
      } else if (oCurrentNode.value > iValue) {
        oCurrentNode = oCurrentNode.left;
      } else {
        return true;
      }
    }
    return false;
  },
  findBiggestInLeft: function (oNode) {
    let oNodeBefore = oNode;
    let oCurrentNode = oNode.left;

    if (oCurrentNode.right === undefined) {
      oNodeBefore.left = oCurrentNode.left;
      return oCurrentNode.value;
    }

    while (oCurrentNode.right !== undefined) {
      oNodeBefore = oCurrentNode;
      oCurrentNode = oCurrentNode.right;
    }

    if (oCurrentNode.left === undefined) {
      oNodeBefore.right = undefined;
      return oCurrentNode.value;
    } else {
      oNodeBefore.right = oCurrentNode.left;
      return oCurrentNode.value;
    }
  },
  delete: function (iValue) {
    if (this.root === undefined) {
      return false;
    }
    if (this.root.value === iValue) {
      if (this.root.left === undefined && this.root.right === undefined) {
        this.root = undefined;
      } else if (this.root.left === undefined) {
        this.root = this.root.right;
      } else if (this.root.right === undefined) {
        this.root = this.root.left;
      } else {
        this.root = new Node(
          this.findBiggestInLeft(this.root),
          this.root.left,
          this.root.right,
        );
      }
      return true;
    }

    let oNodeBefore = undefined;
    let oCurrentNode = this.root;
    while (oCurrentNode.value !== iValue) {
      oNodeBefore = oCurrentNode;
      if (oCurrentNode.value > iValue) {
        oCurrentNode = oCurrentNode.left;
      } else if (oCurrentNode.value < iValue) {
        oCurrentNode = oCurrentNode.right;
      }
      if (oCurrentNode === undefined) {
        return false;
      }
    }

    if (oCurrentNode.left === undefined && oCurrentNode.right === undefined) {
      if (oNodeBefore.value < iValue) {
        oNodeBefore.right = undefined;
      } else {
        oNodeBefore.left = undefined;
      }
    } else if (oCurrentNode.right === undefined) {
      if (oNodeBefore.value < iValue) {
        oNodeBefore.right = oCurrentNode.left;
      } else {
        oNodeBefore.left = oCurrentNode.left;
      }
    } else if (oCurrentNode.left === undefined) {
      if (oNodeBefore.value < iValue) {
        oNodeBefore.right = oCurrentNode.right;
      } else {
        oNodeBefore.left = oCurrentNode.right;
      }
    } else {
      if (oNodeBefore.value < iValue) {
        oNodeBefore.right = new Node(
          this.findBiggestInLeft(oCurrentNode),
          oCurrentNode.left,
          oCurrentNode.right,
        );
      } else {
        oNodeBefore.left = new Node(
          this.findBiggestInLeft(oCurrentNode),
          oCurrentNode.left,
          oCurrentNode.right,
        );
      }
    }
    return true;
  },
};

var input = [];

for (let i = 0; i < 100; i++) {
  input[i] = Math.round(Math.random() * 100);
  while (!BST.insert(input[i])) {
    input[i] = Math.round(Math.random() * 100);
  }
}

for (let i = 0; i < 50; i++) {
  if (!BST.delete(input[i])) {
    console.log(BST.search(input[i]));
    console.log("error while delet");
  }
}

for (let i = 0; i < 50; i++) {
  if (BST.search(input[i])) {
    console.log("value is still there" + input[i]);
  }
}

for (let i = 50; i < 100; i++) {
  BST.search(input[i]);
  if (!BST.search(input[i])) {
    console.log("Error:Value is not in there", input[i]);
  } else {
    console.log("found");
  }
}
