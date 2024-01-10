import React, { useState, useEffect} from 'react';
import { Editor, EditorState, RichUtils, Modifier, CompositeDecorator } from 'draft-js';
import Button from './Button';
import {  convertFromRaw } from 'draft-js';

const findUnderlineEntities = (contentBlock, callback) => {
  const text = contentBlock.getText();
  const regex = /\*\*\* /g;
  let matchArr;
  while ((matchArr = regex.exec(text)) !== null) {
    const start = matchArr.index;
    const end = start + contentBlock.getLength(); // Include the entire block
    callback(start, end);
  }
};

const UnderlineSpan = (props) => {
  return <u>{props.children}</u>;
};

const decorator = new CompositeDecorator([
  {
    strategy: findUnderlineEntities,
    component: UnderlineSpan,
  },
]);

const CombinedEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty(decorator));

  // useEffect(() => {
  //   // Load content from localStorage on component mount
  //   const savedContent = localStorage.getItem('editorContent');
  //   if (savedContent) {
  //     const contentState = JSON.parse(savedContent);
  //     setEditorState(EditorState.createWithContent(contentState, decorator));
  //   }
  // }, []); // Run only once on mount

  // ...

  useEffect(() => {
    const savedContent = localStorage.getItem('editorContent');
    
    if (savedContent) {
      try {
        const contentState = convertFromRaw(JSON.parse(savedContent));
        const newEditorState = EditorState.createWithContent(contentState, decorator);
        setEditorState(newEditorState);
      } catch (error) {
        console.error("Error loading content from localStorage:", error);
      }
    }
  }, []);
  


const saveContent = () => {
  const contentState = editorState.getCurrentContent();
  console.log(contentState); // Log the content to the console
  const contentJSON = JSON.stringify(contentState);
  localStorage.setItem('editorContent', contentJSON);
};

  const handleBeforeInput = (char, editorState) => {
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const currentBlock = contentState.getBlockForKey(selection.getStartKey());
    const blockText = currentBlock.getText();
  
    // Check if the user is typing "** " at the end
      if (char === ' ' && blockText ==='**'){
      // Remove the "** " characters
      const newContentState = Modifier.replaceText(
        contentState,
        selection.merge({
          anchorOffset: blockText.length - 2,
          focusOffset: blockText.length 
        }),
        ''
      );
  
      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        'replace-text'
      );
  
      setEditorState(newEditorState);
      const editorWithBold = RichUtils.toggleInlineStyle(newEditorState, 'RED_TEXT');
  setEditorState(editorWithBold);
      return 'handled';
    }
  
    // Check if the user is typing "*" at the beginning for bold
    if (char === ' ' && blockText === '*') {
      // Remove the "*" character
      const newContentState = Modifier.replaceText(
        contentState,
        selection.merge({
          anchorOffset: 0,
          focusOffset: 1,
        }),
        ''
      );
  
      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        'replace-text'
      );
  
      // Toggle bold style
      const editorWithBold = RichUtils.toggleInlineStyle(newEditorState, 'BOLD');
      setEditorState(editorWithBold);
      return 'handled';
    }
  
    // Check if the user is typing "#" at the beginning of a line and pressing space
    if (char === ' ' && blockText === '#') {
      // Remove the "#" character
      const newContentState = Modifier.replaceText(
        contentState,
        selection.merge({
          anchorOffset: 0,
          focusOffset: 1,
        }),
        ''
      );
  
      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        'replace-text'
      );
  
      // Change the block type to heading
      const contentWithHeading = Modifier.setBlockType(
        newEditorState.getCurrentContent(),
        newEditorState.getSelection(),
        'header-one'
      );
  
      const editorWithHeading = EditorState.set(newEditorState, {
        currentContent: contentWithHeading,
      });
  
      setEditorState(editorWithHeading);
      return 'handled';
    }
  // Check if the user is typing "*** " at the end
  if (char === ' ' && blockText.endsWith('***')) {
    // Remove the "*** " characters
    const newContentState = Modifier.replaceText(
      contentState,
      selection.merge({
        anchorOffset: blockText.length - 3,
        focusOffset: blockText.length,
      }),
      ''
    );

    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      'replace-text'
    );

    setEditorState(newEditorState);
    setEditorState(newEditorState);
    const editorWithBold = RichUtils.toggleInlineStyle(newEditorState, 'UNDERLINE_BLACK_TEXT');
setEditorState(editorWithBold);
    return 'handled';
  }

  // Check if the user is typing "** " at the end
  if (char === ' ' && blockText.endsWith('**')) {
    // Remove the "** " characters
    const newContentState = Modifier.replaceText(
      contentState,
      selection.merge({
        anchorOffset: blockText.length - 2,
        focusOffset: blockText.length,
      }),
      ''
    );

    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      'replace-text'
    );

    setEditorState(newEditorState);
    return 'handled';
  }

  

    // Check if the user presses Enter
    if (char === ' ' && blockText === '') {
      // Change the block type to 'unstyled' to return to regular format
      const newContentState = Modifier.setBlockType(
        contentState,
        selection,
        'unstyled'
      );
  
      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        'change-block-type'
      );
  
      setEditorState(newEditorState);
      return 'handled';
    }
  
    return 'not-handled';
  };
  

  const handleInputChange = (newEditorState) => {
    const currentContent = newEditorState.getCurrentContent();
    const currentSelection = newEditorState.getSelection();
    const currentBlock = currentContent.getBlockForKey(currentSelection.getStartKey());
    const currentText = currentBlock.getText();

    if (currentText.endsWith('*** ')) {
      // Toggle black text with underline style
      setEditorState(RichUtils.toggleInlineStyle(newEditorState, 'UNDERLINE_BLACK_TEXT'));}

   else if (currentText.endsWith('** ')) {
      // Toggle red text style
      setEditorState(RichUtils.toggleInlineStyle(newEditorState, 'RED_TEXT'));
    } else if (currentText === '* ') {
      // Toggle bold style
      setEditorState(RichUtils.toggleInlineStyle(newEditorState, 'BOLD'));
    } else if (currentText === '# ') {
      // Change the block type to heading
      const contentWithHeading = Modifier.setBlockType(
        newEditorState.getCurrentContent(),
        newEditorState.getSelection(),
        'header-one'
      );

      const editorWithHeading = EditorState.set(newEditorState, {
        currentContent: contentWithHeading,
      });

      setEditorState(editorWithHeading);
    } else {
      setEditorState(newEditorState);
    }
    // saveContent();
  };

  const handleButtonClick = () => {
    // Save content to localStorage when the button is clicked
    saveContent();
  };
  

  const inlineStyleFn = (style) => {
    if (style === 'RED_TEXT') {
      return {
        color: 'red',
        backgroundColor: 'transparent'
      };
    }
  
    if (style === 'UNDERLINE_BLACK_TEXT') {
      return {
        color: 'black',
        textDecoration: 'underline',
      };
    }
  
    return {};
  };
  
  const handleKeyCommand = (command, editorState) => {
    if (command === 'handleEnter') {
      const contentState = editorState.getCurrentContent();
      const selection = editorState.getSelection();
      const currentBlock = contentState.getBlockForKey(selection.getStartKey());
      const blockText = currentBlock.getText();

  
      // Check if the user is in a heading block and presses Enter
      if (blockText.startsWith('#')) {
        const contentWithoutHeading = Modifier.setBlockType(
          contentState,
          selection,
          'unstyled'
        );
  
        const editorWithoutHeading = EditorState.set(editorState, {
          currentContent: contentWithoutHeading,
        });
  
        setEditorState(editorWithoutHeading);
        return 'handled';
      }
    }
    return 'not-handled';
  };
  
  
  
  return (
    <div>
      <Editor
          editorState={editorState}
          onChange={handleInputChange}
          handleBeforeInput={handleBeforeInput}
          handleKeyCommand={handleKeyCommand}
              customStyleMap={{
                'RED_TEXT': {
                  color: 'red',
                  backgroundColor: 'transparent'
                },
                'UNDERLINE_BLACK_TEXT': {
                  color: 'black',
                  textDecoration: 'underline',
                },
              }}
              customStyleFn={inlineStyleFn}
        />
          <Button onClick={handleButtonClick} />
    </div>
  );
};

export default CombinedEditor;





// import React, { useState } from 'react';
// import { Editor, EditorState, RichUtils, Modifier, CompositeDecorator } from 'draft-js';

// const findUnderlineEntities = (contentBlock, callback) => {
//   const text = contentBlock.getText();
//   const regex = /\*\*\* /g;
//   let matchArr;
//   while ((matchArr = regex.exec(text)) !== null) {
//     const start = matchArr.index + 4; // Length of "*** "
//     const end = start + contentBlock.getLength() - 4; // Exclude "*** " from length
//     callback(start, end);
//   }
// };

// const UnderlineSpan = (props) => {
//   return <u>{props.children}</u>;
// };

// const decorator = new CompositeDecorator([
//   {
//     strategy: findUnderlineEntities,
//     component: UnderlineSpan,
//   },
// ]);

// const CombinedEditor = () => {
//   const [editorState, setEditorState] = useState(EditorState.createEmpty(decorator));

//   const handleBeforeInput = (char, editorState) => {
//     const contentState = editorState.getCurrentContent();
//     const selection = editorState.getSelection();
//     const currentBlock = contentState.getBlockForKey(selection.getStartKey());
//     const blockText = currentBlock.getText();

//     // Check if the user is typing "**" at the end for red text
//     if (char === ' ' && blockText.endsWith('** ')) {
//       // Remove the "** " characters
//       const newContentState = Modifier.replaceText(
//         contentState,
//         selection.merge({
//           anchorOffset: 0,
//           focusOffset: blockText.length - 2,
//         }),
//         ''
//       );

//       const newEditorState = EditorState.push(
//         editorState,
//         newContentState,
//         'replace-text'
//       );

//       // Toggle red text style
//       const editorWithRedText = RichUtils.toggleInlineStyle(newEditorState, 'RED_TEXT');
//       setEditorState(editorWithRedText);
//       return 'handled';
//     }

//     // Check if the user is typing "*" at the beginning for bold
//     if (char === ' ' && blockText === '* ') {
//       // Remove the "*" characters
//       const newContentState = Modifier.replaceText(
//         contentState,
//         selection.merge({
//           anchorOffset: 0,
//           focusOffset: 1,
//         }),
//         ''
//       );

//       const newEditorState = EditorState.push(
//         editorState,
//         newContentState,
//         'replace-text'
//       );

//       // Toggle bold style
//       setEditorState(RichUtils.toggleInlineStyle(newEditorState, 'BOLD'));
//       return 'handled';
//     }

//     // Check if the user is typing "#" at the beginning of a line and pressing space
//     if (char === ' ' && blockText === '# ') {
//       // Remove the "#" characters
//       const newContentState = Modifier.replaceText(
//         contentState,
//         selection.merge({
//           anchorOffset: 0,
//           focusOffset: 1,
//         }),
//         ''
//       );

//       const newEditorState = EditorState.push(
//         editorState,
//         newContentState,
//         'replace-text'
//       );

//       // Change the block type to heading
//       const contentWithHeading = Modifier.setBlockType(
//         newEditorState.getCurrentContent(),
//         newEditorState.getSelection(),
//         'header-one'
//       );

//       const editorWithHeading = EditorState.set(newEditorState, {
//         currentContent: contentWithHeading,
//       });

//       setEditorState(editorWithHeading);
//       return 'handled';
//     }

//     return 'not-handled';
//   };

//   const handleInputChange = (newEditorState) => {
//     const currentContent = newEditorState.getCurrentContent();
//     const currentSelection = newEditorState.getSelection();
//     const currentBlock = currentContent.getBlockForKey(currentSelection.getStartKey());
//     const currentText = currentBlock.getText();

//     // Check if the user typed "**" and space
//     if (currentText.endsWith('** ')) {
//       // Remove the "** " characters
//       const newContentState = Modifier.replaceText(
//         currentContent,
//         currentSelection.merge({
//           anchorOffset: 0,
//           focusOffset: currentText.length - 2,
//         }),
//         ''
//       );

//       const updatedEditorState = EditorState.push(
//         newEditorState,
//         newContentState,
//         'replace-text'
//       );

//       // Toggle red text style
//       setEditorState(RichUtils.toggleInlineStyle(updatedEditorState, 'RED_TEXT'));
//       return;
//     }

//     // Check if the user typed "*" and space
//     if (currentText === '* ') {
//       // Remove the "*" characters
//       const newContentState = Modifier.replaceText(
//         currentContent,
//         currentSelection.merge({
//           anchorOffset: 0,
//           focusOffset: 1,
//         }),
//         ''
//       );

//       const updatedEditorState = EditorState.push(
//         newEditorState,
//         newContentState,
//         'replace-text'
//       );

//       // Toggle bold style
//       setEditorState(RichUtils.toggleInlineStyle(updatedEditorState, 'BOLD'));
//       return;
//     }

//     // Check if the user typed "#" and space
//     if (currentText === '# ') {
//       // Remove the "#" characters
//       const newContentState = Modifier.replaceText(
//         currentContent,
//         currentSelection.merge({
//           anchorOffset: 0,
//           focusOffset: 1,
//         }),
//         ''
//       );

//       const updatedEditorState = EditorState.push(
//         newEditorState,
//         newContentState,
//         'replace-text'
//       );

//       // Change the block type to heading
//       const contentWithHeading = Modifier.setBlockType(
//         updatedEditorState.getCurrentContent(),
//         updatedEditorState.getSelection(),
//         'header-one'
//       );

//       const editorWithHeading = EditorState.set(updatedEditorState, {
//         currentContent: contentWithHeading,
//       });

//       setEditorState(editorWithHeading);
//       return;
//     }

//     setEditorState(newEditorState);
//   };

//   const inlineStyleFn = (style) => {
//     if (style === 'RED_TEXT') {
//       return {
//         color: 'red',
//       };
//     }
//     return {};
//   };

//   return (
//     <div>
//       <h2>Combined Editor</h2>
//       <Editor
//         editorState={editorState}
//         onChange={handleInputChange}
//         handleBeforeInput={handleBeforeInput}
//         customStyleMap={{
//           'RED_TEXT': {
//             color: 'red',
//           },
//         }}
//         customStyleFn={inlineStyleFn}
//       />
//     </div>
//   );
// };

// export default CombinedEditor;







// import React, { useState } from 'react';
// import { Editor, EditorState, RichUtils, Modifier, CompositeDecorator } from 'draft-js';

// const findUnderlineEntities = (contentBlock, callback) => {
//   const text = contentBlock.getText();
//   const regex = /\*\*\* /g;
//   let matchArr;
//   while ((matchArr = regex.exec(text)) !== null) {
//     const start = matchArr.index + 4; // Length of "*** "
//     const end = start + contentBlock.getLength() - 4; // Exclude "*** " from length
//     callback(start, end);
//   }
// };

// const UnderlineSpan = (props) => {
//   return <u>{props.children}</u>;
// };

// const decorator = new CompositeDecorator([
//   {
//     strategy: findUnderlineEntities,
//     component: UnderlineSpan,
//   },
// ]);



// const CombinedEditor = () => {
//   const [editorState, setEditorState] = useState(EditorState.createEmpty(decorator));

//   const handleBeforeInput = (char, editorState) => {
//     const contentState = editorState.getCurrentContent();
//     const selection = editorState.getSelection();
//     const currentBlock = contentState.getBlockForKey(selection.getStartKey());
//     const blockText = currentBlock.getText();

//     // Check if the user is typing "**" at the end for red text
//     if (char === ' ' && blockText.endsWith('** ')) {
//       // Remove the "** " characters
//       const newContentState = Modifier.replaceText(
//         contentState,
//         selection.merge({
//           anchorOffset: 0,
//           focusOffset: blockText.length - 2,
//         }),
//         ''
//       );

//       const newEditorState = EditorState.push(
//         editorState,
//         newContentState,
//         'replace-text'
//       );

//       // Toggle red text style
//       const editorWithRedText = RichUtils.toggleInlineStyle(newEditorState, 'RED_TEXT');
//       setEditorState(editorWithRedText);
//       return 'handled';
//     }

//     // Check if the user is typing "*" at the beginning for bold
//     if (char === ' ' && blockText === '*') {
//       // Remove the "*" character
//       const newContentState = Modifier.replaceText(
//         contentState,
//         selection.merge({
//           anchorOffset: 0,
//           focusOffset: 1,
//         }),
//         ''
//       );

//       const newEditorState = EditorState.push(
//         editorState,
//         newContentState,
//         'replace-text'
//       );

//       // Toggle bold style
//       const editorWithBold = RichUtils.toggleInlineStyle(newEditorState, 'BOLD');
//       setEditorState(editorWithBold);
//       return 'handled';
//     }

//     // Check if the user is typing "#" at the beginning of a line and pressing space
//     if (char === ' ' && blockText === '#') {
//       // Remove the "#" character
//       const newContentState = Modifier.replaceText(
//         contentState,
//         selection.merge({
//           anchorOffset: 0,
//           focusOffset: 1,
//         }),
//         ''
//       );

//       const newEditorState = EditorState.push(
//         editorState,
//         newContentState,
//         'replace-text'
//       );

//       // Change the block type to heading
//       const contentWithHeading = Modifier.setBlockType(
//         newEditorState.getCurrentContent(),
//         newEditorState.getSelection(),
//         'header-one'
//       );

//       const editorWithHeading = EditorState.set(newEditorState, {
//         currentContent: contentWithHeading,
//       });

//       setEditorState(editorWithHeading);
//       return 'handled';
//     }

//     return 'not-handled';
//   };

//   const handleInputChange = (newEditorState) => {
//     const currentContent = newEditorState.getCurrentContent();
//     const currentSelection = newEditorState.getSelection();
//     const currentBlock = currentContent.getBlockForKey(currentSelection.getStartKey());
//     const currentText = currentBlock.getText();

//     if (currentText.endsWith('** ')) {
//       // Toggle red text style
//       setEditorState(RichUtils.toggleInlineStyle(newEditorState, 'RED_TEXT'));
//     } else if (currentText === '* ') {
//       // Toggle bold style
//       setEditorState(RichUtils.toggleInlineStyle(newEditorState, 'BOLD'));
//     } else if (currentText === '# ') {
//       // Change the block type to heading
//       const contentWithHeading = Modifier.setBlockType(
//         newEditorState.getCurrentContent(),
//         newEditorState.getSelection(),
//         'header-one'
//       );

//       const editorWithHeading = EditorState.set(newEditorState, {
//         currentContent: contentWithHeading,
//       });

//       setEditorState(editorWithHeading);
//     } else {
//       setEditorState(newEditorState);
//     }
//   };

//   const inlineStyleFn = (style) => {
//     if (style === 'RED_TEXT') {
//       return {
//         color: 'red',
//       };
//     }
//     return {};
//   };

//   return (
//     <div>
//       <h2>Combined Editor</h2>
//       <Editor
//         editorState={editorState}
//         onChange={handleInputChange}
//         handleBeforeInput={handleBeforeInput}
//         customStyleMap={{
//           'RED_TEXT': {
//             color: 'red',
//           },
//         }}
//         customStyleFn={inlineStyleFn}
//       />
//     </div>
//   );
// };

// export default CombinedEditor;







// import React, { useState } from 'react';
// import { Editor, EditorState, RichUtils, Modifier } from 'draft-js';
// import 'draft-js/dist/Draft.css';

// const RedTextEditor = () => {
//   const [editorState, setEditorState] = useState(EditorState.createEmpty());

//   const handleBeforeInput = (input) => {
//     const currentContent = editorState.getCurrentContent();
//     const currentSelection = editorState.getSelection();
//     const currentBlock = currentContent.getBlockForKey(currentSelection.getStartKey());
//     const currentText = currentBlock.getText();

//     if (input === ' ' && currentText.endsWith('**')) {
//       // Remove the "**" and space
//       const newContentState = Modifier.replaceText(
//         currentContent,
//         currentSelection.merge({
//           anchorOffset: currentSelection.getStartOffset() - 2,
//           focusOffset: currentSelection.getStartOffset(),
//         }),
//         ''
//       );

//       const newEditorState = EditorState.push(
//         editorState,
//         newContentState,
//         'replace-text'
//       );

//       // Toggle the 'RED_TEXT' style
//       setEditorState(RichUtils.toggleInlineStyle(newEditorState, 'RED_TEXT'));
//       return 'handled';
//     }
//     return 'not-handled';
//   };

//   const handleInputChange = (newEditorState) => {
//     const currentContent = newEditorState.getCurrentContent();
//     const currentSelection = newEditorState.getSelection();
//     const currentBlock = currentContent.getBlockForKey(currentSelection.getStartKey());
//     const currentText = currentBlock.getText();

//     if (currentText.endsWith('** ')) {
//       // Toggle the 'RED_TEXT' style
//       setEditorState(RichUtils.toggleInlineStyle(newEditorState, 'RED_TEXT'));
//     } else {
//       setEditorState(newEditorState);
//     }
//   };

//   const inlineStyleFn = (style) => {
//     if (style === 'RED_TEXT') {
//       return {
//         color: 'red',
//       };
//     }
//     return {};
//   };

//   return (
//     <div>
//       <Editor
//         editorState={editorState}
//         onChange={handleInputChange}
//         handleBeforeInput={handleBeforeInput}
//         customStyleMap={{
//           'RED_TEXT': {
//             color: 'red',
//           },
//         }}
//         customStyleFn={inlineStyleFn}
//       />
//     </div>
//   );
// };

// export default RedTextEditor;















// import React, { useState } from 'react';
// import { Editor, EditorState, Modifier, RichUtils, CompositeDecorator, getDefaultKeyBinding } from 'draft-js';

// const findUnderlineEntities = (contentBlock, callback) => {
//   const text = contentBlock.getText();
//   const regex = /\*\*\* /g;
//   let matchArr;
//   while ((matchArr = regex.exec(text)) !== null) {
//     const start = matchArr.index + 4; // Length of "*** "
//     const end = start + contentBlock.getLength() - 4; // Exclude "*** " from length
//     callback(start, end);
//   }
// };

// const UnderlineSpan = (props) => {
//   return <u>{props.children}</u>;
// };

// const decorator = new CompositeDecorator([
//   {
//     strategy: findUnderlineEntities,
//     component: UnderlineSpan,
//   },
// ]);

// const BoldOnAsteriskPlugin = ({ editorState, setEditorState }) => {
//   const handleKeyCommand = (command) => {
//     if (command === 'asterisk-bold') {
//       const selection = editorState.getSelection();
//       const contentState = editorState.getCurrentContent();
//       const startKey = selection.getStartKey();
//       const startOffset = selection.getStartOffset();
//       const block = contentState.getBlockForKey(startKey);
//       const blockText = block.getText();

//       // Check if the user is typing * and space for bold
//       if (blockText.startsWith('*') && startOffset === 1) {
//         // Remove the * character
//         const newContentState = Modifier.replaceText(
//           contentState,
//           selection.merge({
//             anchorOffset: 0,
//             focusOffset: 1,
//           }),
//           ''
//         );

//         const newEditorState = EditorState.push(
//           editorState,
//           newContentState,
//           'replace-text'
//         );

//         // Toggle bold style
//         const editorWithBold = RichUtils.toggleInlineStyle(newEditorState, 'BOLD');

//         setEditorState(editorWithBold);
//         return 'handled';
//       }
//     }

//     return 'not-handled';
//   };

//   const keyBindingFn = (e) => {
//     if (e.key === ' ' && e.target.textContent.trim() === '*') {
//       return 'asterisk-bold';
//     }
//     return getDefaultKeyBinding(e);
//   };

//   return {
//     handleKeyCommand,
//     keyBindingFn,
//   };
// };

// const CombinedEditor = () => {
//   const [editorState, setEditorState] = useState(EditorState.createEmpty(decorator));
//   const asteriskBoldPlugin = BoldOnAsteriskPlugin({ editorState, setEditorState });

//   const handleEditorChange = (newEditorState) => {
//     setEditorState(newEditorState);
//   };

//   const handleBeforeInput = (char, editorState) => {
//     const contentState = editorState.getCurrentContent();
//     const selection = editorState.getSelection();
//     const currentBlock = contentState.getBlockForKey(selection.getStartKey());
//     const blockText = currentBlock.getText();
  
//     // Check if the user is typing "#" at the beginning of a line and pressing space
//     if (char === ' ' && blockText === '#') {
//       // Remove the "#" character
//       const newContentState = Modifier.replaceText(
//         contentState,
//         selection.merge({
//           anchorOffset: 0,
//           focusOffset: 1,
//         }),
//         ''
//       );
  
//       const newEditorState = EditorState.push(
//         editorState,
//         newContentState,
//         'replace-text'
//       );
  
//       // Change the block type to heading
//       const contentWithHeading = Modifier.setBlockType(
//         newEditorState.getCurrentContent(),
//         newEditorState.getSelection(),
//         'header-one'
//       );
  
//       const editorWithHeading = EditorState.set(newEditorState, {
//         currentContent: contentWithHeading,
//       });
  
//       handleEditorChange(editorWithHeading);
//       return 'handled';
//     }
  
//     // Check if the user pressed Enter after a heading
//     if (char === ' ' && blockText === '#\n') {
//       // Remove the "#\n" characters
//       const newContentState = Modifier.replaceText(
//         contentState,
//         selection.merge({
//           anchorOffset: 0,
//           focusOffset: blockText.length - 1,
//         }),
//         ''
//       );
  
//       const newEditorState = EditorState.push(
//         editorState,
//         newContentState,
//         'replace-text'
//       );
  
//       // Change the block type to unstyled
//       const contentWithoutHeading = Modifier.setBlockType(
//         newEditorState.getCurrentContent(),
//         newEditorState.getSelection(),
//         'unstyled'
//       );
  
//       const editorWithoutHeading = EditorState.set(newEditorState, {
//         currentContent: contentWithoutHeading,
//       });
  
//       handleEditorChange(editorWithoutHeading);
//       return 'handled';
//     }
  
//     // Check if the user is typing "***" at the beginning of a line and pressing space
//     if (char === ' ' && blockText.startsWith('***') && blockText.endsWith(' ')) {
//       // Remove the "***" characters
//       const newContentState = Modifier.replaceText(
//         contentState,
//         selection.merge({
//           anchorOffset: 0,
//           focusOffset: blockText.length - 1,
//         }),
//         ''
//       );
  
//       const newEditorState = EditorState.push(
//         editorState,
//         newContentState,
//         'replace-text'
//       );
  
//       // Change the block type to unstyled
//       const contentWithoutUnderline = Modifier.setBlockType(
//         newEditorState.getCurrentContent(),
//         newEditorState.getSelection(),
//         'unstyled'
//       );
  
//       const editorWithoutUnderline = EditorState.set(newEditorState, {
//         currentContent: contentWithoutUnderline,
//       });
  
//       handleEditorChange(editorWithoutUnderline);
//       return 'handled';
//     }
  
//     return 'not-handled';
//   };
  

//   return (
//     <div>
//       <h2>Combined Editor</h2>
//       <Editor
//         editorState={editorState}
//         onChange={handleEditorChange}
//         handleBeforeInput={handleBeforeInput}
//         handleKeyCommand={asteriskBoldPlugin.handleKeyCommand}
//         keyBindingFn={asteriskBoldPlugin.keyBindingFn}
//       />
//     </div>
//   );
// };

// export default CombinedEditor;





// import React, { useState } from 'react';
// import { Editor, EditorState, ContentState, Modifier, RichUtils, CompositeDecorator, getDefaultKeyBinding } from 'draft-js';

// const findUnderlineEntities = (contentBlock, callback) => {
//   const text = contentBlock.getText();
//   const regex = /\*\*\* /g;
//   let matchArr;
//   while ((matchArr = regex.exec(text)) !== null) {
//     const start = matchArr.index + 4; // Length of "*** "
//     const end = start + contentBlock.getLength() - 4; // Exclude "*** " from length
//     callback(start, end);
//   }
// };

// const UnderlineSpan = (props) => {
//   return <u>{props.children}</u>;
// };

// const decorator = new CompositeDecorator([
//   {
//     strategy: findUnderlineEntities,
//     component: UnderlineSpan,
//   },
// ]);

// const BoldOnAsteriskPlugin = ({ editorState, setEditorState }) => {
//   const handleKeyCommand = (command) => {
//     if (command === 'asterisk-bold') {
//       const selection = editorState.getSelection();
//       const contentState = editorState.getCurrentContent();
//       const startKey = selection.getStartKey();
//       const startOffset = selection.getStartOffset();
//       const block = contentState.getBlockForKey(startKey);
//       const blockText = block.getText();

//       // Check if the user is typing * and space for bold
//       if (blockText.startsWith('*') && startOffset === 1) {
//         // Remove the * character
//         const newContentState = Modifier.replaceText(
//           contentState,
//           selection.merge({
//             anchorOffset: 0,
//             focusOffset: 1,
//           }),
//           ''
//         );

//         const newEditorState = EditorState.push(
//           editorState,
//           newContentState,
//           'replace-text'
//         );

//         // Toggle bold style
//         const editorWithBold = RichUtils.toggleInlineStyle(newEditorState, 'BOLD');

//         setEditorState(editorWithBold);
//         return 'handled';
//       }
//     }

//     return 'not-handled';
//   };

//   const keyBindingFn = (e) => {
//     if (e.key === ' ' && e.target.textContent.trim() === '*') {
//       return 'asterisk-bold';
//     }
//     return getDefaultKeyBinding(e);
//   };

//   return {
//     handleKeyCommand,
//     keyBindingFn,
//   };
// };

// const CombinedEditor = () => {
//   const [editorState, setEditorState] = useState(EditorState.createEmpty(decorator));
//   const asteriskBoldPlugin = BoldOnAsteriskPlugin({ editorState, setEditorState });

//   const handleEditorChange = (newEditorState) => {
//     setEditorState(newEditorState);
//   };

//   const handleBeforeInput = (char, editorState) => {
//     const contentState = editorState.getCurrentContent();
//     const selection = editorState.getSelection();
//     const currentBlock = contentState.getBlockForKey(selection.getStartKey());
//     const blockText = currentBlock.getText();

//     // Check if the user is typing "#" at the beginning of a line and pressing space
//     if (char === ' ' && blockText === '#') {
//       // Remove the "#" character
//       const newContentState = Modifier.replaceText(
//         contentState,
//         selection.merge({
//           anchorOffset: 0,
//           focusOffset: 1,
//         }),
//         ''
//       );

//       const newEditorState = EditorState.push(
//         editorState,
//         newContentState,
//         'replace-text'
//       );

//       // Change the block type to heading
//       const contentWithHeading = Modifier.setBlockType(
//         newEditorState.getCurrentContent(),
//         newEditorState.getSelection(),
//         'header-one'
//       );

//       const editorWithHeading = EditorState.set(newEditorState, {
//         currentContent: contentWithHeading,
//       });

//       handleEditorChange(editorWithHeading);
//       return 'handled';
//     }

//     // Check if the user pressed Enter after a heading
//     if (char === ' ' && blockText === '#\n') {
//       // Remove the "#\n" characters
//       const newContentState = Modifier.replaceText(
//         contentState,
//         selection.merge({
//           anchorOffset: 0,
//           focusOffset: blockText.length - 1,
//         }),
//         ''
//       );

//       const newEditorState = EditorState.push(
//         editorState,
//         newContentState,
//         'replace-text'
//       );

//       // Change the block type to unstyled
//       const contentWithoutHeading = Modifier.setBlockType(
//         newEditorState.getCurrentContent(),
//         newEditorState.getSelection(),
//         'unstyled'
//       );

//       const editorWithoutHeading = EditorState.set(newEditorState, {
//         currentContent: contentWithoutHeading,
//       });

//       handleEditorChange(editorWithoutHeading);
//       return 'handled';
//     }

//     return 'not-handled';
//   };

//   return (
//     <div>
//       <h2>Combined Editor</h2>
//       <Editor
//         editorState={editorState}
//         onChange={handleEditorChange}
//         handleBeforeInput={handleBeforeInput}
//         handleKeyCommand={asteriskBoldPlugin.handleKeyCommand}
//         keyBindingFn={asteriskBoldPlugin.keyBindingFn}
//       />
//     </div>
//   );
// };

// export default CombinedEditor;










// import { Editor, EditorState, Modifier, RichUtils } from 'draft-js';
// import 'draft-js/dist/Draft.css';
// import React from 'react';

// const CustomEditor = () => {
//   const [editorState, setEditorState] = React.useState(() => EditorState.createEmpty());

//   const handleEditorChange = (newEditorState) => {
//     setEditorState(newEditorState);
//   };

//   const handleBeforeInput = (char, editorState) => {
//     const selection = editorState.getSelection();
//     const contentState = editorState.getCurrentContent();
//     const currentBlock = contentState.getBlockForKey(selection.getStartKey());
//     const blockText = currentBlock.getText();

//     // Check if the user is typing # and space for heading
//     if (char === ' ' && blockText.startsWith('#') && selection.getStartOffset() === 1) {
//       // Remove the # character
//       const newContentState = Modifier.replaceText(
//         contentState,
//         selection.merge({
//           anchorOffset: 0,
//           focusOffset: 1,
//         }),
//         ''
//       );

//       const newEditorState = EditorState.push(
//         editorState,
//         newContentState,
//         'replace-text'
//       );

//       // Change the block type to heading
//       const contentWithHeading = Modifier.setBlockType(
//         newEditorState.getCurrentContent(),
//         newEditorState.getSelection(),
//         'header-one'
//       );

//       const editorWithHeading = EditorState.set(editorState, {
//         currentContent: contentWithHeading,
//       });

//       handleEditorChange(editorWithHeading);
//       return 'handled';
//     }

//     // Check if the user is typing * and space for bold
//     if (char === ' ' && blockText.startsWith('*') && selection.getStartOffset() === 1) {
//       // Remove the * character
//       const newContentState = Modifier.replaceText(
//         contentState,
//         selection.merge({
//           anchorOffset: 0,
//           focusOffset: 1,
//         }),
//         ''
//       );

//       const newEditorState = EditorState.push(
//         editorState,
//         newContentState,
//         'replace-text'
//       );

//       // Toggle bold style
//       const editorWithBold = RichUtils.toggleInlineStyle(newEditorState, 'BOLD');

//       handleEditorChange(editorWithBold);
//       return 'handled';
//     }

//     // Check for red line
//     if (char === ' ' && blockText.startsWith('**') && selection.getStartOffset() === 2) {
//       const contentWithRedLine = Modifier.setBlockData(
//         contentState,
//         selection.merge({
//           anchorOffset: 0,
//           focusOffset: 2,
//         }),
//         { 'text-color': 'red-line' }
//       );

//       const editorWithRedLine = EditorState.set(editorState, {
//         currentContent: contentWithRedLine,
//       });

//       handleEditorChange(editorWithRedLine);
//       return 'handled';
//     }

//     // Check for underline
//     if (char === ' ' && blockText.startsWith('***') && selection.getStartOffset() === 3) {
//       // Remove the *** characters
//       const newContentState = Modifier.replaceText(
//         contentState,
//         selection.merge({
//           anchorOffset: 0,
//           focusOffset: 3,
//         }),
//         ''
//       );

//       const newEditorState = EditorState.push(
//         editorState,
//         newContentState,
//         'replace-text'
//       );

//       // Apply underline style
//       const contentWithUnderline = Modifier.applyInlineStyle(
//         newEditorState.getCurrentContent(),
//         newEditorState.getSelection(),
//         'UNDERLINE'
//       );

//       const editorWithUnderline = EditorState.set(editorState, {
//         currentContent: contentWithUnderline,
//       });

//       handleEditorChange(editorWithUnderline);
//       return 'handled';
//     }

//     return 'not-handled';
//   };

//   return (
//     <div>
//       <h2>Editor</h2>
//       <Editor
//         editorState={editorState}
//         onChange={handleEditorChange}
//         handleBeforeInput={handleBeforeInput}
//       />
//     </div>
//   );
// };

// export default CustomEditor;


