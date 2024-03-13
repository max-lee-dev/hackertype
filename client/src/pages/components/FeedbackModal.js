import React, {useState, useEffect} from "react";
import {
  Text,
  Box,
  Divider,
  ModalFooter,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Badge,
} from "@chakra-ui/react";
import {db} from "./firebase";
import {auth} from "./firebase";
import {collection, doc, getDoc, setDoc, getDocs, query, where} from "firebase/firestore";

export default function FeedbackModal({isFeedbackOpen, onFeedbackClose}) {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const addedGreen = "#37c47b";
  const fixedYellow = "#ffe91f";
  const css = document.querySelector(":root");
  const style = getComputedStyle(css);
  var bgcolor = style.getPropertyValue("--backgroundColor");
  var mainText = style.getPropertyValue("--mainText");
  var logoColor = style.getPropertyValue("--logoColor");
  var subtleText = style.getPropertyValue("--subtleText");
  var themeBackground = style.getPropertyValue("--themeBackground");
  var themeActiveButton = style.getPropertyValue("--themeActiveButton");

  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState(auth.currentUser?.email);
  const [thanks, setThanks] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (auth.currentUser) {
      setEmail(auth.currentUser.email);
      setUsername(auth.currentUser.displayName)

    }


  }, [auth])

  useEffect(() => {
    if (isFeedbackOpen) {
      setThanks(false);
    }
  }, [isFeedbackOpen]);


  function handleSubmit(event) {
    event.preventDefault();
    const feedbackRef = doc(db, "feedback", email + Date.parse(Date()));
    setDoc(feedbackRef, {
      feedback: feedback,
      email: email,
      username: username,
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
      when: Date.now(),

    });
    setFeedback("");
    setEmail("");
    setThanks(true);
  }


  return (
    <>
      <Modal
        isOpen={isFeedbackOpen}
        onClose={onFeedbackClose}
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        size="6xl">
        <ModalOverlay/>
        <ModalContent bgColor={bgcolor} minHeight={"500px"}>
          <ModalHeader>
            <Box className="searchModal">
              <Text className="mainTextClass mainFont" fontSize="32px">
                feedback
              </Text>
              <ModalCloseButton/>
            </Box>
          </ModalHeader>

          <ModalBody>
            <Box>
              <form onSubmit={handleSubmit}>
                <Box className="searchModal">
                  <Text className="mainTextClass mainFont" fontSize="24px">
                    feedback
                  </Text>
                </Box>
                <Box className="searchModal">
                  <Text className="subtleTextColor  mainFont" fontSize="18px">
                  </Text>
                </Box>
                <Box className="searchModal">
                                    <textarea
                                      className="mainTextClass mainFont"
                                      style={{
                                        width: "100%", height: "200px", fontSize: "18px",
                                        backgroundColor: bgcolor,
                                        borderColor: subtleText,
                                        borderWidth: "1px",
                                        color: mainText,
                                        borderRadius: "5px",
                                        paddingLeft: 5,


                                      }}
                                      placeholder={"what are your thoughts on hackertype? any suggestions?\n"}
                                      value={feedback}
                                      onChange={(e) => setFeedback(e.target.value)}
                                    />
                </Box>
                <Box className="searchModal">
                  <Text className="mainTextClass mainFont" fontSize="24px">
                    email
                  </Text>
                </Box>
                <Box className="searchModal">
                  <Text className="subtleTextColor mainFont" fontSize="18px">
                    (optional so i can get back to you)
                  </Text>
                </Box>
                <Box className="searchModal">
                  <input
                    className="mainFont mainTextClass"
                    style={{
                      width: "100%",
                      height: "40px",
                      fontSize: "18px",
                      backgroundColor: bgcolor,
                      borderColor: subtleText,
                      borderWidth: "1px",
                      color: mainText,
                      borderRadius: "5px",
                      paddingLeft: 5,
                      marginBottom: 20,
                    }}
                    placeholder={auth.currentUser ? auth.currentUser.email : "email"}

                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Box>
                <Box className="searchModal">
                  <button
                    className="mainFont"
                    style={{
                      width: "100%",
                      height: "40px",
                      fontSize: "18px",
                      backgroundColor: subtleText,
                      color: bgcolor,
                      border: "none",
                      borderRadius: "5px",
                    }}
                    type="submit">
                    submit
                  </button>
                  <Text>
                    {thanks && (
                      <Text
                        className={'mainTextClass mainFont'}
                        fontSize="18px"
                        borderRadius="5px"
                        pt="30px">
                        thanks for your feedback! :)
                      </Text>
                    )}
                  </Text>
                </Box>
              </form>
            </Box>


          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
