// =========================
// PDF UPLOAD
// =========================

const form = document.getElementById("uploadForm");

if (form) {

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const formData = new FormData(form);

        const response = await fetch("/api/docs/upload", {

            method: "POST",

            body: formData

        });

        const result = await response.json();

        alert(result.message);

        if (response.ok) {

            form.reset();

        }

    });

}

  
  
// =========================
// HOMEPAGE CONTENT UPLOAD
// =========================

const contentForm =
    document.getElementById("contentForm");


if (contentForm) {

    contentForm.addEventListener("submit", async (e) => {

        e.preventDefault();


        const contentSubmitButton =
            document.getElementById(
                "contentSubmitButton"
            );


        // Disable button while uploading

        if (contentSubmitButton) {

            contentSubmitButton.disabled = true;

            contentSubmitButton.textContent =
                "Uploading...";

        }


        try {

            const formData =
                new FormData(contentForm);


            const response =
                await fetch("/api/content", {

                    method: "POST",

                    body: formData

                });


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Failed to upload content"
                );

            }


            alert(
                "Content added successfully!"
            );


            contentForm.reset();


        } catch (error) {

            console.error(
                "Content upload error:",
                error
            );


            alert(
                error.message ||
                "Something went wrong."
            );


        } finally {


            // Enable button again

            if (contentSubmitButton) {

                contentSubmitButton.disabled = false;

                contentSubmitButton.textContent =
                    "Add Content";

            }

        }

    });

}




// =========================
// DOCUMENTS
// =========================

const docsContainer =
    document.getElementById("docsContainer");

let allDocuments = [];


if (docsContainer) {

    loadDocuments();

}


// =========================
// LOAD DOCUMENTS
// =========================

async function loadDocuments() {

    // Get loading spinner

    const loading =
        document.getElementById("docsLoading");


    // Show spinner

    if (loading) {

        loading.style.display = "flex";

    }


    try {

        const response =
            await fetch("/api/docs");


        if (!response.ok) {

            throw new Error(
                "Failed to load documents"
            );

        }


        const docs =
            await response.json();


        // Save all documents for searching

        allDocuments = docs;


        // Display documents

        displayDocuments(docs);


    } catch (error) {

        console.error(
            "Error loading documents:",
            error
        );


        docsContainer.innerHTML = `

            <p>
                Unable to load documents.
                Please try again.
            </p>

        `;


    } finally {

        // Hide spinner

        if (loading) {

            loading.style.display = "none";

        }

    }

}


// =========================
// DISPLAY DOCUMENTS
// =========================

function displayDocuments(docs) {

    docsContainer.innerHTML = "";


    if (docs.length === 0) {

        docsContainer.innerHTML = `
            <p>No documents found.</p>
        `;

        return;

    }


    docs.forEach(doc => {

        docsContainer.innerHTML += `

        <div class="document">

            <div>

                <h3>📄 ${doc.name}</h3>

                <p>
                    ${new Date(doc.uploadedAt).toLocaleDateString()}
                </p>

            </div>


            <div class="menu">

                <button class="menuBtn">
                    ⋮
                </button>


                <div class="dropdown">

                    <a
                        href="${doc.pdfUrl}"
                        target="_blank"
                    >
                        Open
                    </a>


                    <a
                        href="${doc.pdfUrl}"
                        download
                    >
                        Download
                    </a>


                    <button
                        class="deleteBtn"
                        data-id="${doc._id}"
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>

        `;

    });

}


// =========================
// SEARCH DOCUMENTS
// =========================

const searchInput =
    document.getElementById("searchInput");

const searchButton =
    document.getElementById("searchButton");


function searchDocuments() {

    const searchText =
        searchInput.value.trim().toLowerCase();


    const filteredDocuments =
        allDocuments.filter(doc => {

            return doc.name
                .toLowerCase()
                .includes(searchText);

        });


    displayDocuments(filteredDocuments);

}


if (searchInput) {

    searchInput.addEventListener(
        "input",
        searchDocuments
    );

}


if (searchButton) {

    searchButton.addEventListener(
        "click",
        searchDocuments
    );

}


// =========================
// DELETE DOCUMENT
// =========================

document.addEventListener("click", async (e) => {

    if (e.target.classList.contains("deleteBtn")) {

        const id =
            e.target.dataset.id;


        const confirmed =
            confirm(
                "Are you sure you want to delete this document?"
            );


        if (!confirmed) {

            return;

        }


        const response =
            await fetch("/api/docs/" + id, {

                method: "DELETE"

            });


        const result =
            await response.json();


        alert(result.message);


        if (response.ok) {

            loadDocuments();

        }

    }

});


// =========================
// MOBILE MENU
// =========================

const menuToggle =
    document.getElementById("menuToggle");

const navLinks =
    document.getElementById("navLinks");


if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

        navLinks.classList.toggle("active");

    });

}


// =========================
// COPYRIGHT YEAR
// =========================

const year =
    document.getElementById("year");


if (year) {

    year.textContent =
        new Date().getFullYear();

}

// =========================
// OPEN HOMEPAGE CONTENT
// =========================

async function openContent(id, url) {

    try {

        // Count the view

        await fetch(
            "/api/content/" + id + "/view",
            {
                method: "POST"
            }
        );


        // Open the content

        window.open(
            url,
            "_blank"
        );


    } catch (error) {

        console.error(
            "Error counting view:",
            error
        );


        // Still open the content
        // even if view counting fails

        window.open(
            url,
            "_blank"
        );

    }

}


// =========================
// HOMEPAGE SEARCH
// =========================

const homeSearch =
    document.getElementById("homeSearch");

const homeSearchButton =
    document.getElementById("homeSearchButton");


async function searchHomepage() {

    if (!homeSearch) {
        return;
    }


    const query =
        homeSearch.value.trim();


    if (!query) {

        alert("Please enter something to search.");

        return;

    }


    try {

        const response =
            await fetch(
                "/api/content/search?q=" +
                encodeURIComponent(query)
            );


        if (!response.ok) {

            throw new Error(
                "Search failed"
            );

        }


        const results =
            await response.json();


        // Remove any old search results

        const oldResults =
            document.getElementById(
                "searchResults"
            );

        if (oldResults) {

            oldResults.remove();

        }


        // Create results section

        const resultsSection =
            document.createElement("section");


        resultsSection.id =
            "searchResults";


        resultsSection.className =
            "content-section";


        // Heading

        resultsSection.innerHTML = `

            <div class="section-heading">

                <h2>
                    🔎 Search results for "${query}"
                </h2>

            </div>

            <div class="content-grid"
                 id="searchResultsGrid">

            </div>

        `;


        const homeMain =
            document.querySelector(
                ".home-main"
            );


        const searchSection =
            document.querySelector(
                ".home-search"
            );


        homeMain.insertBefore(
            resultsSection,
            searchSection.nextSibling
        );


        const resultsGrid =
            document.getElementById(
                "searchResultsGrid"
            );


        // No results

        if (results.length === 0) {

            resultsGrid.innerHTML = `

                <p style="padding:20px;">
                    No results found for "${query}".
                </p>

            `;

            return;

        }


        // Display results

        results.forEach(item => {

            resultsGrid.innerHTML += `

                <a
                    href="${item.contentUrl || '#'}"
                    class="content-card content-link"
                    data-id="${item._id}"
                    target="_blank"
                >

                    <div class="card-image">

                        ${
                            item.imageUrl

                            ?

                            `<img
                                src="${item.imageUrl}"
                                alt="${item.title}"
                            >`

                            :

                            `🔎`

                        }

                    </div>


                    <div class="card-content">

                        <h3>
                            ${item.title}
                        </h3>


                        <p>
                            ${item.description || ""}
                        </p>


                        <small>
                            ${item.category}
                        </small>

                    </div>

                </a>

            `;

        });


    } catch (error) {

        console.error(
            "Search error:",
            error
        );


        alert(
            "Something went wrong while searching."
        );

    }

}


// Search button

if (homeSearchButton) {

    homeSearchButton.addEventListener(
        "click",
        searchHomepage
    );

}


// Search when pressing Enter

if (homeSearch) {

    homeSearch.addEventListener(
        "keydown",
        (e) => {

            if (e.key === "Enter") {

                searchHomepage();

            }

        }
    );

}


// =========================
// ADMIN CONTENT MANAGEMENT
// =========================

const adminContentList =
    document.getElementById(
        "adminContentList"
    );

const adminContentLoading =
    document.getElementById(
        "adminContentLoading"
    );


// Only run on admin page

if (adminContentList) {

    loadAdminContent();

}


// =========================
// LOAD ADMIN CONTENT
// =========================

async function loadAdminContent() {

    if (adminContentLoading) {

        adminContentLoading.style.display =
            "flex";

    }


    try {

        const response =
            await fetch("/api/content");


        if (!response.ok) {

            throw new Error(
                "Failed to load content"
            );

        }


        const content =
            await response.json();


        displayAdminContent(content);


    } catch (error) {

        console.error(
            "Admin content error:",
            error
        );


        adminContentList.innerHTML = `

            <p class="admin-error">

                Unable to load content.

            </p>

        `;


    } finally {

        if (adminContentLoading) {

            adminContentLoading.style.display =
                "none";

        }

    }

}


// =========================
// DISPLAY ADMIN CONTENT
// =========================

function displayAdminContent(content) {

    adminContentList.innerHTML = "";


    if (content.length === 0) {

        adminContentList.innerHTML = `

            <div class="admin-empty">

                <p>
                    No homepage content yet.
                </p>

            </div>

        `;

        return;

    }


    content.forEach(item => {

        const card =
            document.createElement("div");


        card.className =
            "admin-content-card";


        card.innerHTML = `

            <div class="admin-content-info">

                ${
                    item.imageUrl

                    ? `

                        <img
                            src="${item.imageUrl}"
                            alt="${item.title}"
                            class="admin-content-image"
                        >

                    `

                    : `

                        <div
                            class="admin-content-placeholder"
                        >
                            📄
                        </div>

                    `
                }


                <div class="admin-content-details">

                    <h3>
                        ${item.title}
                    </h3>


                    <p>
                        ${item.description || ""}
                    </p>


                    <small>
                        ${item.category}
                        ·
                        ${item.views || 0} views
                    </small>

                </div>

            </div>


<div class="admin-content-actions">

    <button
        type="button"
        class="admin-edit-content"
        data-id="${item._id}"
    >
        ✏️ Edit
    </button>

    <button
        type="button"
        class="admin-delete-content"
        data-id="${item._id}"
    >
        🗑 Delete
    </button>

</div>

        `;


        adminContentList.appendChild(card);

    });

}


// =========================
// DELETE HOMEPAGE CONTENT
// =========================

document.addEventListener(
    "click",
    async (e) => {

        if (
            !e.target.classList.contains(
                "admin-delete-content"
            )
        ) {

            return;

        }


        const button =
            e.target;


        const id =
            button.dataset.id;


        const confirmed =
            confirm(
                "Are you sure you want to delete this content?"
            );


        if (!confirmed) {

            return;

        }


        button.disabled = true;

        button.textContent =
            "Deleting...";


        try {

            const response =
                await fetch(
                    "/api/content/" + id,
                    {
                        method: "DELETE"
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Delete failed"
                );

            }


            alert(
                "Content deleted successfully."
            );


            loadAdminContent();


        } catch (error) {

            console.error(
                "Delete error:",
                error
            );


            alert(
                error.message ||
                "Unable to delete content."
            );


            button.disabled = false;

            button.textContent =
                "🗑 Delete";

        }

    }
);


// =========================
// EDIT CONTENT
// =========================

const editModal =
    document.getElementById(
        "editContentModal"
    );

const editForm =
    document.getElementById(
        "editContentForm"
    );

const closeEditContent =
    document.getElementById(
        "closeEditContent"
    );


document.addEventListener("click", (e) => {

    if (
        !e.target.classList.contains(
            "admin-edit-content"
        )
    ) {

        return;

    }


    const id =
        e.target.dataset.id;


    openEditContent(id);

});


// =========================
// OPEN EDIT FORM
// =========================

async function openEditContent(id) {

    try {

        const response =
            await fetch("/api/content");


        const content =
            await response.json();


        const item =
            content.find(
                item => item._id === id
            );


        if (!item) {

            alert("Content not found.");

            return;

        }


        document.getElementById(
            "editContentId"
        ).value = item._id;


        document.getElementById(
            "editTitle"
        ).value = item.title || "";


        document.getElementById(
            "editDescription"
        ).value =
            item.description || "";


        document.getElementById(
            "editCategory"
        ).value =
            item.category || "Other";


        document.getElementById(
            "editImageUrl"
        ).value =
            item.imageUrl || "";


        document.getElementById(
            "editContentUrl"
        ).value =
            item.contentUrl || "";


        editModal.style.display =
            "flex";


    } catch (error) {

        console.error(error);

        alert(
            "Unable to open content."
        );

    }

}


// =========================
// SAVE EDIT
// =========================

if (editForm) {

    editForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


            const id =
                document.getElementById(
                    "editContentId"
                ).value;


            const button =
                document.getElementById(
                    "editContentButton"
                );


            const data = {

                title:
                    document.getElementById(
                        "editTitle"
                    ).value,

                description:
                    document.getElementById(
                        "editDescription"
                    ).value,

                category:
                    document.getElementById(
                        "editCategory"
                    ).value,

                imageUrl:
                    document.getElementById(
                        "editImageUrl"
                    ).value,

                contentUrl:
                    document.getElementById(
                        "editContentUrl"
                    ).value

            };


            button.disabled = true;

            button.textContent =
                "Saving...";


            try {

                const response =
                    await fetch(
                        "/api/content/" + id,
                        {

                            method: "PUT",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(data)

                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Update failed"
                    );

                }


                alert(
                    "Content updated successfully."
                );


                editModal.style.display =
                    "none";


                loadAdminContent();


            } catch (error) {

                console.error(error);

                alert(
                    error.message ||
                    "Unable to update content."
                );

            } finally {

                button.disabled = false;

                button.textContent =
                    "Save Changes";

            }

        }
    );

}


// =========================
// CLOSE EDIT MODAL
// =========================

if (closeEditContent) {

    closeEditContent.addEventListener(
        "click",
        () => {

            editModal.style.display =
                "none";

        }
    );

}


if (editModal) {

    editModal.addEventListener(
        "click",
        (e) => {

            if (e.target === editModal) {

                editModal.style.display =
                    "none";

            }

        }
    );

}


// =========================
// CONTENT VIEW TRACKING
// =========================

document.addEventListener("click", async (e) => {

    const contentLink =
        e.target.closest(".content-link");

    if (!contentLink) {
        return;
    }

    const id =
        contentLink.dataset.id;

    if (!id) {
        return;
    }

    try {

        await fetch("/api/content/" + id + "/view", {

            method: "POST"

        });

    } catch (error) {

        console.error(
            "Unable to record view:",
            error
        );

    }

});