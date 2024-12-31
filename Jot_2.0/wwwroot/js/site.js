if (!window.isAppInitialized) {
    window.isAppInitialized = true; // Ensure the app is only initialized once
    console.log("Initializing application...");

    document.addEventListener("DOMContentLoaded", () => {
        const toCoverList = document.getElementById("to-cover-list");
        const coveredList = document.getElementById("covered-list");
        const copyCovered = document.getElementById("copy-covered");
        const sessionButtons = document.querySelectorAll(".session-btn");
        const addTopicButton = document.getElementById("add-topic");
        const editModeToggle = document.getElementById("edit-mode-toggle");
        const customerBackground = document.getElementById("customer-background");
        const specialNotes = document.getElementById("special-notes");
        const nextSteps = document.getElementById("next-steps");

        let currentSession = "1"; // Default session
        let topicCounter = 0; // Unique counter for dynamically added topics
        let isEditMode = false; // Edit mode toggle
        let draggedItem = null; // Tracks the item being dragged

        // Save session data to localStorage
        const saveSessionData = () => {
            const topics = {
                toCover: Array.from(toCoverList.querySelectorAll(".editable-topic")).map((topic) => ({
                    id: topic.getAttribute("data-topic-id"),
                    content: topic.innerHTML,
                })),
                covered: Array.from(coveredList.querySelectorAll(".editable-topic")).map((topic) => ({
                    id: topic.getAttribute("data-topic-id"),
                    content: topic.innerHTML,
                })),
                notes: {
                    customerBackground: customerBackground?.value || "",
                    specialNotes: specialNotes?.value || "",
                    nextSteps: nextSteps?.value || "",
                },
            };
            localStorage.setItem(`session-${currentSession}`, JSON.stringify(topics));
            console.log(`Saved data for session ${currentSession}:`, topics);
        };

        // Load session data from localStorage
        const loadSessionData = () => {
            const data = JSON.parse(localStorage.getItem(`session-${currentSession}`)) || {
                toCover: [],
                covered: [],
                notes: { customerBackground: "", specialNotes: "", nextSteps: "" },
            };
            toCoverList.innerHTML = "";
            coveredList.innerHTML = "";

            // Populate "To Be Covered" list
            data.toCover.forEach((topic) => {
                const li = createTopicElement(topic.id, topic.content, toCoverList);
                toCoverList.appendChild(li);
            });

            // Populate "Covered" list
            data.covered.forEach((topic) => {
                const li = createTopicElement(topic.id, topic.content, coveredList);
                coveredList.appendChild(li);
            });

            // Ensure notes structure exists and populate fields
            const notes = data.notes || { customerBackground: "", specialNotes: "", nextSteps: "" };
            customerBackground.value = notes.customerBackground || "";
            specialNotes.value = notes.specialNotes || "";
            nextSteps.value = notes.nextSteps || "";

            console.log(`Loaded data for session ${currentSession}:`, data);
        };

        // Toggle edit mode
        editModeToggle.addEventListener("click", () => {
            isEditMode = !isEditMode;

            // Toggle contenteditable and delete button visibility
            document.querySelectorAll(".editable-topic").forEach((topic) => {
                topic.setAttribute("contenteditable", isEditMode);
            });

            document.querySelectorAll(".delete-topic").forEach((button) => {
                button.style.display = isEditMode ? "inline-block" : "none";
            });

            addTopicButton.style.display = isEditMode ? "inline-block" : "none";
            editModeToggle.textContent = isEditMode ? "Save" : "Edit Mode";

            if (!isEditMode) saveSessionData(); // Save changes when exiting edit mode
        });

        // Add a new topic
        addTopicButton.addEventListener("click", () => {
            topicCounter += 1;
            const newTopicId = `new-topic-${topicCounter}`;
            const li = createTopicElement(newTopicId, "New Topic", toCoverList);
            toCoverList.appendChild(li);
            console.log(`Added new topic with ID: ${newTopicId}`);
            saveSessionData();
        });

        // Create a new topic element
        const createTopicElement = (id, content, parentList) => {
            const li = document.createElement("li");
            li.draggable = parentList === toCoverList; // Make draggable only for "To Be Covered"
            li.innerHTML = `
                <div class="editable-topic" contenteditable="${isEditMode}" data-topic-id="${id}">${content}</div>
                <button class="delete-topic" style="display: ${isEditMode ? "inline-block" : "none"};">X</button>
            `;
            li.querySelector(".delete-topic").addEventListener("click", () => deleteTopic(li));
            if (parentList === toCoverList) {
                initializeDragEvents(li);
            }
            initializeMoveListenerForItem(li, parentList);
            return li;
        };

        // Initialize drag-and-drop events for "To Be Covered" items
        const initializeDragEvents = (item) => {
            item.addEventListener("dragstart", (e) => {
                draggedItem = item;
                setTimeout(() => (item.style.display = "none"), 0);
            });

            item.addEventListener("dragend", () => {
                draggedItem = null;
                item.style.display = "block";
                saveSessionData(); // Save the new order after dragging
            });

            item.addEventListener("dragover", (e) => {
                e.preventDefault();
            });

            item.addEventListener("dragenter", (e) => {
                e.preventDefault();
                item.classList.add("drag-over");
            });

            item.addEventListener("dragleave", () => {
                item.classList.remove("drag-over");
            });

            item.addEventListener("drop", () => {
                item.classList.remove("drag-over");
                if (draggedItem && draggedItem !== item) {
                    toCoverList.insertBefore(draggedItem, item); // Reorder items
                }
            });
        };

        // Copy the "Covered" list and notes to the clipboard
        // Copy the "Covered" and "To Be Covered" topics, along with notes, to the clipboard
        copyCovered.addEventListener("click", () => {
            // Gather topics from the "Covered" list
            const coveredTopics = Array.from(coveredList.querySelectorAll(".editable-topic"))
                .map((topic) => topic.textContent.trim())
                .join("\n");

            // Gather topics from the "To Be Covered" list
            const toBeCoveredTopics = Array.from(toCoverList.querySelectorAll(".editable-topic"))
                .map((topic) => topic.textContent.trim())
                .join("\n");

            // Gather text from the notes section
            const notesText = `
Customer Background:
${customerBackground?.value.trim()}

Special Notes:
${specialNotes?.value.trim()}

Next Steps:
${nextSteps?.value.trim()}
    `;

            // Combine all data into the final text
            const finalText = `
Topics Covered:
${coveredTopics}

Topics not covered:
${toBeCoveredTopics}

${notesText}
    `.trim();

            // Copy to clipboard
            navigator.clipboard.writeText(finalText).then(() => {
                console.log("Copied content to clipboard.");
                alert("Topics and notes have been copied to the clipboard!"); // Optional feedback for the user
            }).catch((err) => {
                console.error("Failed to copy content: ", err);
            });
        });



        // Initialize move listeners for items
        const initializeMoveListenerForItem = (item, parentList) => {
            item.addEventListener("click", function onClickHandler() {
                if (!isEditMode) {
                    if (parentList === toCoverList) {
                        moveItem(item, coveredList);
                        item.removeEventListener("click", onClickHandler);
                        initializeMoveListenerForItem(item, coveredList);
                    } else if (parentList === coveredList) {
                        moveItem(item, toCoverList);
                        item.removeEventListener("click", onClickHandler);
                        initializeMoveListenerForItem(item, toCoverList);
                        initializeDragEvents(item); // Reattach drag events when moving back
                    }
                }
            });
        };

        // Move an item to a target list
        const moveItem = (item, targetList) => {
            if (item.parentNode !== targetList) {
                targetList.appendChild(item);
                item.draggable = targetList === toCoverList; // Enable drag-and-drop only for "To Be Covered"
                saveSessionData();
            }
        };

        // Add reset button functionality
        const resetButton = document.getElementById("reset-topics");

        resetButton.addEventListener("click", () => {
            // Move all topics from "Topics Covered" back to "Topics to Cover"
            const coveredTopics = Array.from(coveredList.children);
            coveredTopics.forEach((item) => {
                moveItem(item, toCoverList); // Move each topic back
                initializeDragEvents(item);  // Reattach drag events for to-cover items
            });

            // Clear the text fields
            customerBackground.value = "";
            specialNotes.value = "";
            nextSteps.value = "";

            // Save the reset state to localStorage
            saveSessionData();

            console.log("Reset button clicked. Topics moved and text fields cleared.");
        });


        // Highlight the selected session button
        const highlightSelectedSession = () => {
            sessionButtons.forEach((button) => {
                button.classList.remove("active-session");
            });
            const activeButton = document.querySelector(`.session-btn[data-session="${currentSession}"]`);
            if (activeButton) {
                activeButton.classList.add("active-session");
            }
        };

        // Delete a topic and save the data
        const deleteTopic = (li) => {
            li.remove();
            saveSessionData();
        };

        // Initialize session button functionality
        sessionButtons.forEach((button) => {
            button.addEventListener("click", () => {
                saveSessionData();
                currentSession = button.getAttribute("data-session");
                loadSessionData();
                highlightSelectedSession(); // Highlight the selected session
            });
        });

        // Initialize the application
        loadSessionData();
        highlightSelectedSession(); // Highlight the initial session
    });
}
