import { currentSelectedChild, setCurrentSelectedChild, getCurrentSelectedChild  } from './shared.js';
import { selectedDate } from './calendar.js';

let currentDashboardButton = null;
let currentSelectedAttribute = null;
let selectedEntryId=null;

let deleteChildrenButton = document.getElementById('delete-bttn');

const dashboardMain = document.querySelector('#dashboard-main');
const dashboardProfile = document.querySelector('#dashboard-profile');
const dashboardAdminPanel = document.querySelector('#dashboard-admin-panel');
const dashboardGroups = document.querySelector('#dashboard-groups');

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
    }
}

function getLocalISOString() {
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now - timezoneOffset).toISOString().slice(0, 19);
    return localISOTime.replace('T', ' ');
}

const addChildForm = document.querySelector('.add-child-bttn');
const addTableForm = document.querySelector('.add-table-bttn');

document.getElementById('casatorit').addEventListener('change', function() {
    const partnerNameGroup = document.getElementById('nume-partener-group');
    if (this.checked) {
        partnerNameGroup.style.display = 'block';
    } else {
        partnerNameGroup.style.display = 'none';
    }
});

document.querySelectorAll('.close-button').forEach(button => {
    button.addEventListener('click', function() {
        this.closest('.main-modal').style.display = 'none';
    });
});

document.querySelectorAll('.confirm-button').forEach(button => {
    button.addEventListener('click', function() {
        this.closest('.main-modal').style.display = 'none';
    });
});

window.addEventListener('click', (event) => {
    document.querySelectorAll('.main-modal').forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

var buttonDisplayMap = {
    "feeding-bttn": document.getElementById('feeding_items'),
    "sleeping-bttn": document.getElementById('sleeping_items'),
    "media-bttn": document.getElementById('mediaElement'),
    "evolution-bttn": document.getElementById('evolutionElement'),
    "medical-bttn": document.getElementById('medicalElement')
};

currentSelectedAttribute = document.getElementById('feeding-bttn');

if (currentSelectedAttribute) {
    currentSelectedAttribute.style.border = "2px solid black";
}

if (buttonDisplayMap['feeding-bttn']) {
    buttonDisplayMap['feeding-bttn'].style.display = "";
}

document.querySelectorAll('.attribute-button').forEach(function (button) {
    button.addEventListener('click', function () {
        if (currentSelectedAttribute) {
            currentSelectedAttribute.style.border = "";
        }

        for (var key in buttonDisplayMap) {
            if (buttonDisplayMap[key]) {
                buttonDisplayMap[key].style.display = "none";
            }
        }

        if (this.id in buttonDisplayMap && buttonDisplayMap[this.id]) {
            buttonDisplayMap[this.id].style.display = "";
        }

        if (this.id === 'feeding-bttn' || this.id === 'sleeping-bttn') {
            document.getElementById('calendarContainer').style.display = "";
        } else {
            document.getElementById('calendarContainer').style.display = "none";
        }

        currentSelectedAttribute = this;
        console.log(currentSelectedAttribute.id);
        this.style.border = "2px solid black";
    });
});

document.getElementById('feeding-bttn').click();

var span = document.getElementsByClassName("close")[0];

var btn = document.getElementById("addPhoto");

    fetchAccountData();

    document.querySelectorAll('.dashboard-button').forEach(function (button) {

        if (!currentDashboardButton && button.id == 'dashboard_bttn') {
            dashboardAdminPanel.style.display = "none";
            dashboardProfile.style.display = "none";
            dashboardMain.style.display = "";
            dashboardGroups.style.display = "none";
    
            currentDashboardButton = button;
            button.style.backgroundColor = "var(--button-color)";
        }
    
        button.addEventListener('click', function () {
            if (currentDashboardButton) {
                currentDashboardButton.style.backgroundColor = "";
            }
            if (this.id == "dashboard_bttn") {
                dashboardMain.style.display = "";
                dashboardProfile.style.display = "none";
                dashboardAdminPanel.style.display = "none";
                dashboardGroups.style.display = "none";
            }
            if (this.id == 'profile_bttn') {
                dashboardMain.style.display = "none";
                dashboardProfile.style.display = "";
                dashboardAdminPanel.style.display = "none";
                dashboardGroups.style.display = "none";
            }
            if (this.id == 'dashboard_admin_bttn') {
                dashboardMain.style.display = "none";
                dashboardProfile.style.display = "none";
                dashboardAdminPanel.style.display = "";
                dashboardGroups.style.display = "none";
            }
            if (this.id == 'groups_bttn') {
                dashboardMain.style.display = "none";
                dashboardProfile.style.display = "none";
                dashboardAdminPanel.style.display = "none";
                dashboardGroups.style.display = "";
            }
    
            currentDashboardButton = this;
            this.style.backgroundColor = "var(--button-color)";
        });
    });

    

    export function fetchFeedingEntries(date, childID) {
        const cookieString = document.cookie;
        const token = cookieString.substring(4);
    
        if (!token) {
            console.error('JWT token not found');
            alert('JWT token not found');
            return;
        }
    
        const dateString = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().split('T')[0];
    
        fetch(`http://localhost:5000/api/get_feeding_entries_by_date?date=${dateString}&childID=${childID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(result => {
            console.log('Result:', result);
            if (result.feedingEntries) {
                displayFeedingEntries(result.feedingEntries);
            } else {
                displayFeedingEntries([]);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            displayFeedingEntries([]);
        });
    }

    

    function displayFeedingEntries(entries) {
        const feedingItemsContainer = document.getElementById("feeding_items");
        feedingItemsContainer.innerHTML = "";

        if (entries.length === 0) {
            feedingItemsContainer.innerHTML = "<p>No entries for the selected date.</p>";
        }
    
        entries.forEach(entry => {
            const entryDiv = document.createElement("div");
            entryDiv.className = "calendar-item";
            entryDiv.dataset.entryId = entry.ID;
    
            const timeP = document.createElement("p");
            timeP.textContent = entry.Time.slice(0, 5);
    
            const foodP = document.createElement("p");
            foodP.textContent = `- ${entry.Quantity}${entry.Unit} ${entry.FoodType}`;
    
            entryDiv.appendChild(timeP);
            entryDiv.appendChild(foodP);
            entryDiv.addEventListener('click', function() {
                document.querySelectorAll('.calendar-item.selected').forEach(el => {
                    el.classList.remove('selected');
                });
                entryDiv.classList.add('selected');
                selectedEntryId = entry.ID;
            });
            feedingItemsContainer.appendChild(entryDiv);
        });
    }

    deleteChildrenButton.addEventListener('click', function()
    {
        if (!currentSelectedChild) {
            alert("Please select a child first.");
            return;
        }

        const selectedChildId = currentSelectedChild.dataset.childId;
        currentSelectedChild = null;

        const cookieString = document.cookie;
        const token = cookieString.substring(4);

        if (!token) {
            console.error('JWT token not found');
            alert('JWT token not found');
            return;
        }

        fetch(`http://localhost:5000/api/delete_children?childID=${selectedChildId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                console.log('Response status:', response.status);
                return response.json();
            })
            .then(result => {
                console.log('Result:', result);
                if (result) {
                } else {
                    console.error('Error: ' + result.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            })
            .finally(() => {
                loadChildren()});
    });

    function loadChildren() {
        const cookieString = document.cookie;
        const token = cookieString.substring(4);

        if (!token) {
            alert('JWT token not found');
            return;
        }

        fetch('http://localhost:5000/api/get_user_children', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            return response.json();
        })
        .then(result => {
            console.log('Result:', result);
            if (result.childrenInfo) {
                displayChildren(result.childrenInfo);
                addChildSelectionHandler();
            } else {
                console.error('Error: ' + result.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function displayChildren(children) {
        const dashboardChildren = document.getElementById('user-children-id');
        const childrenAddButton = document.getElementById('add-child-bttn');
        console.log('Children:', children);

        while (dashboardChildren.firstChild && dashboardChildren.firstChild !== childrenAddButton) {
            dashboardChildren.removeChild(dashboardChildren.firstChild);
        }

        const header = document.createElement('p');
        header.textContent = 'Copiii tăi inregistrați';
        dashboardChildren.insertBefore(header, childrenAddButton);

        children.forEach(child => {
            const childContainer = createChildElement(child);
            dashboardChildren.insertBefore(childContainer, childrenAddButton);
        });
    }

    function createChildElement(child) {
        const childContainer = document.createElement('div');
        childContainer.className = 'children-container';
        childContainer.dataset.childId = child.ID;
    
        const img = document.createElement('img');
        img.src = child.PictureRef ? `http://localhost:5000/api/src/${child.PictureRef}` : '../placeholders/child2.jpg';
        img.className = 'photo-container';
        img.alt = 'child';
    
        const infoContainer = document.createElement('div');
        infoContainer.className = 'info-container';
    
        const nameP = document.createElement('p');
        nameP.textContent = `${child.FirstName} ${child.LastName}`;
    
        const ageP = document.createElement('p');
        ageP.textContent = calculateAge(child.DateOfBirth) + ' ani - ' + getAgeCategory(calculateAge(child.DateOfBirth));
    
        infoContainer.appendChild(nameP);
        infoContainer.appendChild(ageP);
    
        childContainer.appendChild(img);
        childContainer.appendChild(infoContainer);
    
        return childContainer;
    }

    function calculateAge(dateOfBirth) {
        const dob = new Date(dateOfBirth);
        const diff_ms = Date.now() - dob.getTime();
        const age_dt = new Date(diff_ms);

        return Math.abs(age_dt.getUTCFullYear() - 1970);
    }

    function getAgeCategory(age) {
        if (age < 3) return 'infant';
        if (age < 13) return 'copil';
        if (age < 18) return 'adolescent';
        return 'adult';
    }

    function addChildSelectionHandler() {
        document.querySelectorAll('.children-container').forEach(function(button) {

            if (!currentSelectedChild) {
                setCurrentSelectedChild(button);
                const selectedChildId = currentSelectedChild.dataset.childId;
                fetchFeedingEntries(selectedDate, selectedChildId);
                fetchSleepingEntries(selectedDate, selectedChildId);
                fetchChildrenMedia(selectedChildId);
                button.style.border = "2px solid gray";
            }

            button.addEventListener('click', function() {
                if (currentSelectedChild) {
                    currentSelectedChild.style.border = "";
                }
                setCurrentSelectedChild(this);
                this.style.border = "2px solid gray";
                const selectedChildId = currentSelectedChild.dataset.childId;
                fetchFeedingEntries(selectedDate, selectedChildId);
                fetchSleepingEntries(selectedDate, selectedChildId);
                fetchChildrenMedia(selectedChildId);
            });
        });
    }

    loadChildren();

    document.getElementById('add-child-form').addEventListener('submit', async function(e) {
        e.preventDefault();
    
        const form = document.getElementById('add-child-form');
        const formData = new FormData(form);
    
        const cookieString = document.cookie;
        const token = cookieString.substring(4);
    
        if (!token) {
            alert('JWT token not found');
            return;
        }
    
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
    
        try {
            const response = await fetch('http://localhost:5000/api/insert_children', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
    
            console.log('Response status:', response.status);
            const result = await response.json();
            console.log('Result:', result);
    
            if (response.ok) {
                const newChild = createChildElement({
                    FirstName: formData.get('prenume'),
                    LastName: formData.get('nume'),
                    Gender: formData.get('sex'),
                    DateOfBirth: formData.get('data-nasterii'),
                    PictureRef: result.PictureRef
                });
                document.getElementById('user-children-id').insertBefore(newChild, document.getElementById('add-child-bttn'));
                addChildSelectionHandler();
            } else {
                if (result.status === 10) {
                    alert('Invalid or expired JWT token. Redirecting to login page.');
                    window.location.href = '/login';
                } else {
                    alert('Error: ' + result.message);
                }
            }
        } catch (error) {
            console.error('Error:', error);
        } finally
        {
            loadChildren();
        }
    });

    document.getElementById('add-child-bttn').addEventListener('click', () => {
        showModal('add-child-modal');
    });
    
    document.getElementById('add-group-bttn').addEventListener('click', () => {
        showModal('add-group-modal');
    });
    
    document.getElementById('edit-account-bttn').addEventListener('click', () => {
        showModal('edit-account-modal');
        fetchAccountData();
    });

    document.getElementById('add-entry-bttn').addEventListener('click', () => {
        if (currentSelectedAttribute.id === 'feeding-bttn') {
            resetMealForm();
            openMealModal('Adaugă o nouă masă', 'Adaugă', addMeal);
        } else if (currentSelectedAttribute.id === 'sleeping-bttn') {
            resetSleepingForm();
            openSleepingModal('Adaugă o perioadă de somn', 'Adaugă', addSleeping);
        }
    });
    
    document.getElementById('edit-entry-bttn').addEventListener('click', () => {
        if (!selectedEntryId) {
            alert("Please select an entry first.");
            return;
        }
    
        if (currentSelectedAttribute.id === 'feeding-bttn') {
            openMealModal('Modifică o masă curentă', 'Modifică', editMeal);
            fetchFeedingEntryData();
        } else if (currentSelectedAttribute.id === 'sleeping-bttn') {
            openSleepingModal('Modifică o perioadă de somn', 'Modifică', editSleeping);
            fetchSleepingEntryData();
        }
    });

    document.getElementById('delete-entry-bttn').addEventListener('click', () => {
        if (!selectedEntryId) {
            alert("Please select an entry first.");
            return;
        }
    
        if (currentSelectedAttribute.id === 'feeding-bttn') {
            deleteFeedingEntry();
        } else if (currentSelectedAttribute.id === 'sleeping-bttn') {
            deleteSleepingEntry();
        }
    });

    document.getElementById('add-photo-bttn').addEventListener('click', () => {
        resetMediaForm();
        showModal('add-photo-modal');
    });

    function openMealModal(title, buttonText, submitHandler) {
        document.getElementById('meal-modal-title').textContent = title;
        document.getElementById('confirm-meal-bttn').textContent = buttonText;
        const form = document.getElementById('meal-form');
        form.onsubmit = submitHandler;
        showModal('meal-modal');
    }

    function openSleepingModal(title, buttonText, submitHandler) {
        document.getElementById('sleeping-modal-title').textContent = title;
        document.getElementById('confirm-sleeping-bttn').textContent = buttonText;
        const form = document.getElementById('sleeping-form');
        form.onsubmit = submitHandler;
        showModal('sleeping-modal');
    }

    function resetMealForm() {
        document.getElementById('meal-form').reset();
        document.getElementById('use-current-date-time-checkbox').checked = true;
        document.getElementById('date-and-time-inputs-meal').style.display = 'none';
    }

    function resetMediaForm() {
        document.getElementById('add-photo-modal').querySelector('form').reset();
        document.getElementById('use-current-date-time-checkbox-media').checked = true;
        document.getElementById('date-and-time-inputs-media').style.display = 'none';
    }

    document.getElementById('use-current-date-checkbox-sleep').addEventListener('change', function() {
        const dateInput = document.getElementById('date-input-sleep');
        if (this.checked) {
            dateInput.style.display = 'none';
        } else {
            dateInput.style.display = 'block';
        }
    });

    document.getElementById('use-current-date-time-checkbox').addEventListener('change', function() {
        const dateAndTimeInputs = document.getElementById('date-and-time-inputs-meal');
        if (this.checked) {
            dateAndTimeInputs.style.display = 'none';
        } else {
            dateAndTimeInputs.style.display = 'block';
        }
    });

    document.getElementById('use-current-date-time-checkbox-media').addEventListener('change', function() {
        const dateAndTimeInputs = document.getElementById('date-and-time-inputs-media');
        if (this.checked) {
            dateAndTimeInputs.style.display = 'none';
        } else {
            dateAndTimeInputs.style.display = 'block';
        }
    });

    function resetSleepingForm() {
        document.getElementById('sleeping-form').reset();
        document.getElementById('use-current-date-checkbox-sleep').checked = true;
        document.getElementById('date-input-sleep').style.display = 'none';
    }
    
    async function addMeal(e) {
        e.preventDefault();
    
        if (!currentSelectedChild) {
            alert("Please select a child first.");
            return;
        }
    
        const selectedChildId = currentSelectedChild.dataset.childId;
    
        const useCurrentDateTime = document.getElementById('use-current-date-time-checkbox').checked;
        let date, time;
    
        if (useCurrentDateTime) {
            date = getLocalISOString().split(' ')[0];
            time = getLocalISOString().split(' ')[1];
        } else {
            date = document.getElementById('data_table').value;
            time = document.getElementById('time_table').value + ":00";
        }
    
        const unit = document.getElementById('mass-selector').value === 'grame' ? 'g' : 'mg';
        const quantity = document.getElementById('mass-input').value;
        const foodType = document.getElementById('food').value;
    
        const payload = {
            ID: selectedChildId,
            Date: date,
            Time: time,
            Unit: unit,
            Quantity: parseInt(quantity, 10),
            FoodType: foodType,
        };
    
        console.log('Add meal payload:', payload);
    
        const cookieString = document.cookie;
        const token = cookieString.substring(4);
    
        if (!token) {
            console.error('JWT token not found');
            alert('JWT token not found');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:5000/api/insert_feeding_entry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
    
            console.log('Response status (addMeal):', response.status);
            const result = await response.json();
            console.log('Result (addMeal):', result);
    
            if (response.ok) {
                fetchFeedingEntries(selectedDate, selectedChildId);
                document.getElementById('meal-modal').style.display = 'none';
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error (addMeal):', error);
            alert('An error occurred while adding the meal.');
        }
    }
    
    async function editMeal(e) {
        e.preventDefault();
    
        if (!currentSelectedChild) {
            alert("Please select a child first.");
            return;
        }
    
        const selectedChildId = currentSelectedChild.dataset.childId;
    
        const useCurrentDateTime = document.getElementById('use-current-date-time-checkbox').checked;
        let date, time;
    
        if (useCurrentDateTime) {
            date = getLocalISOString().split(' ')[0];
            time = getLocalISOString().split(' ')[1];
        } else {
            date = document.getElementById('data_table').value;
            time = document.getElementById('time_table').value + ":00";
        }
    
        const unit = document.getElementById('mass-selector').value === 'grame' ? 'g' : 'mg';
        const quantity = document.getElementById('mass-input').value;
        const foodType = document.getElementById('food').value;
    
        const payload = {
            ID: selectedEntryId,
            Date: date,
            Time: time,
            Unit: unit,
            Quantity: parseInt(quantity, 10),
            FoodType: foodType,
        };
    
        console.log('Edit meal payload:', payload);
    
        const cookieString = document.cookie;
        const token = cookieString.substring(4);
    
        if (!token) {
            console.error('JWT token not found');
            alert('JWT token not found');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:5000/api/edit_feeding_entry', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
    
            console.log('Response status (editMeal):', response.status);
            const result = await response.json();
            console.log('Result (editMeal):', result);
    
            if (response.ok) {
                fetchFeedingEntries(selectedDate, selectedChildId);
                document.getElementById('meal-modal').style.display = 'none';
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error (editMeal):', error);
            alert('An error occurred while updating the meal.');
        }
    }

    function fetchFeedingEntryData() {
        const cookieString = document.cookie;
        const token = cookieString.substring(4);
    
        if (!token) {
            alert('JWT token not found');
            return;
        }
    
        fetch(`http://localhost:5000/api/get_feeding_entry?id=${selectedEntryId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(result => {
            if (result.feedingEntry) {
                autoCompleteEditForm(result.feedingEntry);
            } else {
                alert('Feeding entry not found');
            }
        })
        .catch(error => {
            console.error('Error fetching entry details:', error);
            alert('An error occurred while fetching the entry details.');
        });
    }

    async function deleteFeedingEntry() {
        const cookieString = document.cookie;
        const token = cookieString.substring(4);
    
        if (!token) {
            console.error('JWT token not found');
            alert('JWT token not found');
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:5000/api/delete_feeding_entry?id=${selectedEntryId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            const result = await response.json();
            console.log('Result:', result);
    
            if (response.ok) {
                const selectedChildId = currentSelectedChild.dataset.childId;
                fetchFeedingEntries(selectedDate, selectedChildId);
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            alert('An error occurred while deleting the feeding entry.');
        }
    }

    async function addSleeping(e) {
        e.preventDefault();
    
        if (!currentSelectedChild) {
            alert("Please select a child first.");
            return;
        }
    
        const selectedChildId = currentSelectedChild.dataset.childId;
    
        const useCurrentDateTime = document.getElementById('use-current-date-checkbox-sleep').checked;
        let date, sleepTime, awakeTime;
    
        if (useCurrentDateTime) {
            date = getLocalISOString().split(' ')[0];
        } else {
            date = document.getElementById('data_sleep').value;
        }
        sleepTime = document.getElementById('time_sleep').value + ":00";
            awakeTime = document.getElementById('time_awake').value + ":00";
    
        const payload = {
            ID: selectedChildId,
            Date: date,
            SleepTime: sleepTime,
            AwakeTime: awakeTime
        };
    
        console.log(payload);
    
        const cookieString = document.cookie;
        const token = cookieString.substring(4);
    
        if (!token) {
            console.error('JWT token not found');
            alert('JWT token not found');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:5000/api/insert_sleeping_entry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
    
            console.log('Response status:', response.status);
            const result = await response.json();
            console.log('Result:', result);
    
            if (response.ok) {
                fetchSleepingEntries(selectedDate, selectedChildId);
                document.getElementById('sleeping-modal').style.display = 'none';
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding the sleeping entry.');
        }
    }
    
    async function editSleeping(e) {
        e.preventDefault();
    
        if (!currentSelectedChild) {
            alert("Please select a child first.");
            return;
        }
    
        const selectedChildId = currentSelectedChild.dataset.childId;
    
        const useCurrentDateTime = document.getElementById('use-current-date-checkbox-sleep').checked;
        let date, sleepTime, awakeTime;
    
        if (useCurrentDateTime) {
            date = getLocalISOString().split(' ')[0];
        } else {
            date = document.getElementById('data_sleep').value;
            
        }

        sleepTime = document.getElementById('time_sleep').value + ":00";
        awakeTime = document.getElementById('time_awake').value + ":00";
    
        const payload = {
            ID: selectedEntryId,
            Date: date,
            SleepTime: sleepTime,
            AwakeTime: awakeTime
        };
    
        console.log(payload);
    
        const cookieString = document.cookie;
        const token = cookieString.substring(4);
    
        if (!token) {
            console.error('JWT token not found');
            alert('JWT token not found');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:5000/api/edit_sleeping_entry', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
    
            console.log('Response status:', response.status);
            const result = await response.json();
            console.log('Result:', result);
    
            if (response.ok) {
                fetchSleepingEntries(selectedDate, selectedChildId);
                document.getElementById('sleeping-modal').style.display = 'none';
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while updating the sleeping entry.');
        }
    }
    
    function fetchSleepingEntryData() {
        const cookieString = document.cookie;
        const token = cookieString.substring(4);
    
        if (!token) {
            console.error('JWT token not found');
            alert('JWT token not found');
            return;
        }
    
        fetch(`http://localhost:5000/api/get_sleeping_entry?id=${selectedEntryId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(result => {
            if (result.sleepingEntry) {
                autoCompleteSleepingForm(result.sleepingEntry);
            } else {
                alert('Sleeping entry not found');
            }
        })
        .catch(error => {
            console.error('Error fetching entry details:', error);
            alert('An error occurred while fetching the entry details.');
        });
    }

    export function fetchSleepingEntries(date, childID) {
        const cookieString = document.cookie;
        const token = cookieString.substring(4);
    
        if (!token) {
            console.error('JWT token not found');
            alert('JWT token not found');
            return;
        }
    
        const dateString = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().split('T')[0];
    
        fetch(`http://localhost:5000/api/get_sleeping_entries_by_date?date=${dateString}&childID=${childID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(result => {
            console.log('Result:', result);
            if (result.sleepingEntries) {
                displaySleepingEntries(result.sleepingEntries);
            } else {
                displaySleepingEntries([]);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            displaySleepingEntries([]);
        });
    }

    async function deleteSleepingEntry() {
        const cookieString = document.cookie;
        const token = cookieString.substring(4);
    
        if (!token) {
            console.error('JWT token not found');
            alert('JWT token not found');
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:5000/api/delete_sleeping_entry?id=${selectedEntryId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            const result = await response.json();
            console.log('Result:', result);
    
            if (response.ok) {
                const selectedChildId = currentSelectedChild.dataset.childId;
                fetchSleepingEntries(selectedDate, selectedChildId);
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            alert('An error occurred while deleting the sleeping entry.');
        }
    }
    
    function displaySleepingEntries(entries) {
        const sleepingItemsContainer = document.getElementById("sleeping_items");
        sleepingItemsContainer.innerHTML = "";
    
        if (entries.length === 0) {
            sleepingItemsContainer.innerHTML = "<p>No entries for the selected date.</p>";
            return;
        }
    
        entries.forEach(entry => {
            const entryDiv = document.createElement("div");
            entryDiv.className = "calendar-item";
            entryDiv.dataset.entryId = entry.ID;
    
            const sleepTime = entry.SleepTime.slice(0, 5);
            const awakeTime = entry.AwakeTime.slice(0, 5); 
    
            const sleepDuration = calculateSleepDuration(entry.SleepTime, entry.AwakeTime);
    
            const timeP = document.createElement("p");
            timeP.textContent = `${sleepTime} - ${awakeTime}`;
    
            const durationP = document.createElement("p");
            durationP.textContent = `- ${sleepDuration}`;
    
            entryDiv.appendChild(timeP);
            entryDiv.appendChild(durationP);
            entryDiv.addEventListener('click', function() {
                document.querySelectorAll('.calendar-item.selected').forEach(el => {
                    el.classList.remove('selected');
                });
                entryDiv.classList.add('selected');
                selectedEntryId = entry.ID;
            });
            sleepingItemsContainer.appendChild(entryDiv);
        });
    }
    
    function calculateSleepDuration(sleepTime, awakeTime) {
        const sleepDate = new Date(`1970-01-01T${sleepTime}Z`);
        const awakeDate = new Date(`1970-01-01T${awakeTime}Z`);
    
        if (awakeDate < sleepDate) {
            awakeDate.setDate(awakeDate.getDate() + 1);
        }
    
        const durationMs = awakeDate - sleepDate;
        const hours = Math.floor(durationMs / 1000 / 60 / 60);
        const minutes = Math.floor((durationMs / 1000 / 60) % 60);
    
        return `${hours} hours and ${minutes} minutes`;
    }
    
    
    function autoCompleteSleepingForm(entry) {
        document.getElementById('data_sleep').value = entry.Date.split('T')[0];
        document.getElementById('time_sleep').value = entry.SleepTime.slice(0, 5);
        document.getElementById('time_awake').value = entry.AwakeTime.slice(0, 5);
    }
    
    function autoCompleteEditForm(entry) {
        console.log('Auto-completing form with entry:', entry);
        document.getElementById('data_table').value = entry.Date.split('T')[0];
        document.getElementById('time_table').value = entry.Time.slice(0, 5);
        document.getElementById('mass-selector').value = entry.Unit === 'g' ? 'grame' : 'miligrame';
        document.getElementById('mass-input').value = entry.Quantity;
        document.getElementById('food').value = entry.FoodType;
    }

    document.getElementById('add-media-form').addEventListener('submit', async function(e) {
        e.preventDefault();
    
        if (!currentSelectedChild) {
            alert("Please select a child first.");
            return;
        }
    
        const selectedChildId = currentSelectedChild.dataset.childId;
        const useCurrentDateTime = document.getElementById('use-current-date-time-checkbox-media').checked;
        const addToTimeline = document.getElementById('add-to-timeline-checkbox').checked;
        let date, time;
    
        if (useCurrentDateTime) {
            const now = new Date();
            date = now.toISOString().split('T')[0];
            time = now.toTimeString().split(' ')[0];
        } else {
            date = document.getElementById('data_media').value;
            time = document.getElementById('time_media').value + ":00";
        }
    
        const fileInput = document.getElementById('mediaInput');
        if (fileInput.files.length === 0) {
            alert('Please select a file.');
            return;
        }
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('ChildrenID', selectedChildId);
        formData.append('Date', date);
        formData.append('Time', time);
        formData.append('InTimeline', addToTimeline ? '1' : '0');
        formData.append('MediaType', file.type);
        formData.append('PictureRef', file);
    
        const cookieString = document.cookie;
        const token = cookieString.substring(4);
    
        if (!token) {
            console.error('JWT token not found');
            alert('JWT token not found');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:5000/api/insert_media', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
    
            console.log('Response status:', response.status);
            const result = await response.json();
            console.log('Result:', result);
    
            if (response.ok) {
                fetchChildrenMedia(selectedChildId);
                document.getElementById('add-photo-modal').style.display = 'none';
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding the media entry.');
        }
    });
    

    document.getElementById('delete').addEventListener('click', async function() {
        const entryId = this.dataset.entryId;
    
        if (!entryId) {
            alert("No media entry selected.");
            return;
        }
    
        const cookieString = document.cookie;
        const token = cookieString.substring(4);
    
        if (!token) {
            console.error('JWT token not found');
            alert('JWT token not found');
            return;
        }
    
        try {
            console.log('Deleting media entry with ID:', entryId);
            const response = await fetch(`http://localhost:5000/api/delete_media?id=${entryId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            const result = await response.json();
            console.log('Result:', result);
    
            if (response.ok) {
                const selectedChildId = currentSelectedChild.dataset.childId;
                fetchChildrenMedia(selectedChildId);
                document.getElementById('myModal').style.display = 'none';
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            alert('An error occurred while deleting the media entry.');
        }
    });
    
    function fetchChildrenMedia(childID) {
        const cookieString = document.cookie;
        const token = cookieString.substring(4);
    
        if (!token) {
            console.error('JWT token not found');
            alert('JWT token not found');
            return;
        }
    
        fetch(`http://localhost:5000/api/get_children_media?childID=${childID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            console.log('Fetch response status:', response.status);
            return response.json();
        })
        .then(result => {
            console.log('Fetch result:', result);
            if (result.media) {
                console.log('Media entries found:', result.media);
                displayMediaEntries(result.media);
            } else {
                console.log('No media entries found.');
                displayMediaEntries([]);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            displayMediaEntries([]);
        });
    }


    function mapAccountTypeToString(accountType) {
        switch (accountType) {
            case 1: return 'familie';
            case 2: return 'individual';
            case 3: return 'casa-de-copii';
            default: return '';
        }
    }
    
    function mapAccountTypeToInteger(accountType) {
        switch (accountType) {
            case 'familie': return 1;
            case 'individual': return 2;
            case 'casa-de-copii': return 3;
            default: return 0;
        }
    }

    addChildSelectionHandler();

    async function fetchAccountData() {
        const cookieString = document.cookie;
        const token = cookieString.substring(4);

        if (!token) {
            alert('JWT token not found');
            return null;
        }

        try {
            const response = await fetch('http://localhost:5000/api/get_self_info', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                fillFormData(data);
                populateProfileData(data.user);
                return data.user;
            } else {
                alert('Error fetching account data');
                return null;
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while fetching account data');
            return null;
        }
    }

    function populateProfileData(userData) {
        const fullName = `${userData.FirstName} ${userData.LastName}`;
        const email = `Email: ${userData.Email}`;
        const phoneNo = `Telefon: ${userData.PhoneNo}`;
        const maritalStatus = `Căsătorit: ${userData.CivilState === 1 ? 'Da' : 'Nu'}`;
        const location = `Localizare: ${userData.Location}`;
        const language = `Limbă: ${userData.Language}`;
        const accountType = `Tipul contului: ${mapAccountTypeToString(userData.AccountType)}`;
        console.log(`http://localhost:5000/api/src/${userData.PictureRef}`);
        const profilePhoto = userData.PictureRef ? `http://localhost:5000/api/src/${userData.PictureRef}` : 'default-profile-photo-url.jpg';

        document.querySelector('.profile-settings-container h1').textContent = fullName;
        document.querySelector('.profile-settings-container:nth-of-type(2) p:nth-of-type(2)').textContent = email;
        document.querySelector('.profile-settings-container:nth-of-type(2) p:nth-of-type(3)').textContent = phoneNo;
        document.querySelector('.profile-settings-container:nth-of-type(5) p:nth-of-type(2)').textContent = maritalStatus;
        document.querySelector('.profile-settings-container:nth-of-type(7) p:nth-of-type(2)').textContent = location;
        document.querySelector('.profile-settings-container:nth-of-type(7) p:nth-of-type(3)').textContent = language;
        document.querySelector('.profile-settings-container:nth-of-type(9) p:nth-of-type(2)').textContent = accountType;
        document.getElementById('user-profile-name').textContent = fullName;
        document.getElementById('user-profile-type').textContent = accountType;
        const profilePhotoElement = document.querySelector('.profile-photo');
        if (profilePhotoElement) {
            profilePhotoElement.src = profilePhoto;
        }

    }
    
    function fillFormData(data) {
        const userData = data.user;
        document.getElementById('lastname').value = userData.LastName;
        document.getElementById('firstname').value = userData.FirstName;
        document.getElementById('email').value = userData.Email;
        document.getElementById('phoneNo').value = userData.PhoneNo;
        document.getElementById('location').value = userData.Location;
        document.getElementById('language').value = userData.Language;
        document.getElementById('accountType').value = mapAccountTypeToString(userData.AccountType);

        if (userData.CivilState == '1') {
            document.getElementById('casatorit').checked = true;
            document.getElementById('nume-partener-group').style.display = 'block';
            document.getElementById('civilPartner').value = userData.CivilPartner;
        } else {
            document.getElementById('casatorit').checked = false;
            document.getElementById('nume-partener-group').style.display = 'none';
            document.getElementById('civilPartner').value = '';
        }
    }

    document.getElementById('casatorit').addEventListener('change', function() {
        const numePartenerGroup = document.getElementById('nume-partener-group');
        if (this.checked) {
            numePartenerGroup.style.display = 'block';
        } else {
            numePartenerGroup.style.display = 'none';
        }
    });

    document.getElementById('edit-account-form').addEventListener('submit', async function(e) {
        e.preventDefault(); 
    
        const form = document.getElementById('edit-account-form');
        const formData = new FormData(form);
    
        const civilStateCheckbox = document.getElementById('casatorit');
        formData.append('civilState', civilStateCheckbox.checked ? '1' : '0');
        
        const numePartenerInput = document.getElementById('civilPartner');
        if (civilStateCheckbox.checked) {
            formData.append('civilPartner', numePartenerInput.value || '');
        } else {
            formData.append('civilPartner', '-1');
        }

        const accountTypeInput = document.getElementById('accountType');
        formData.set('accountType', mapAccountTypeToInteger(accountTypeInput.value));
    
        const cookieString = document.cookie;
        const token = cookieString.substring(4);
    
        if (!token) {
            alert('JWT token not found');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/modify_account_settings', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
    
            console.log('Response status:', response.status);
            const result = await response.json();
            console.log('Result:', result);
    
            if (response.ok) {
                alert('Account updated successfully');
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while updating the account');
        }
    });



function displayMediaEntries(entries) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = "";

    console.log('Displaying media entries:', entries);

    if (entries.length === 0) {
        gallery.innerHTML = "<p>No entries for the selected child.</p>";
        return;
    }

    entries.forEach(entry => {
        const figureElement = document.createElement('figure');

        const mediaType = entry.MediaType.toLowerCase();
        let mediaElement;

        if (mediaType.includes('.jpg') || mediaType.includes('.jpeg') || mediaType.includes('.png') || mediaType.includes('.gif')) {
            mediaElement = document.createElement('img');
            mediaElement.src = `http://localhost:5000/api/src/${entry.PictureRef}`;
            mediaElement.classList.add('modal-image');
        } else if (mediaType.includes('.mp4') || mediaType.includes('.webm') || mediaType.includes('.ogg')) {
            mediaElement = document.createElement('video');
            mediaElement.src = `http://localhost:5000/api/src/${entry.PictureRef}`;
            mediaElement.controls = true;
            mediaElement.classList.add('modal-video');
        } else if (mediaType.includes('.mp3') || mediaType.includes('.wav') || mediaType.includes('.ogg')) {
            mediaElement = document.createElement('audio');
            mediaElement.src = `http://localhost:5000/api/src/${entry.PictureRef}`;
            mediaElement.controls = true;
            mediaElement.classList.add('modal-audio');
        }

        figureElement.appendChild(mediaElement);

        const figcaption = document.createElement('figcaption');
        figcaption.textContent = `${entry.Date.split('T')[0]} ${entry.Time.slice(0, 5)}`;
        figureElement.appendChild(figcaption);

        gallery.appendChild(figureElement);

        mediaElement.addEventListener('click', function () {
            openMediaModal(mediaElement, figcaption.textContent, entry.ID);
        });
    });
}

function openMediaModal(mediaElement, caption, entryId) {
    const modal = document.getElementById("myModal");
    const modalImg = document.getElementById("img01");
    const modalVideo = document.getElementById("vid01");
    const modalAudio = document.getElementById("aud01");
    const captionText = document.getElementById("caption");
    const deleteButton = document.getElementById("delete");
    const closeButton = modal.querySelector('.close');

    modal.style.display = "block";
    captionText.innerHTML = caption;
    deleteButton.dataset.entryId = entryId;

    if (mediaElement.tagName === 'IMG') {
        modalImg.src = mediaElement.src;
        modalImg.style.display = 'block';
        modalVideo.style.display = 'none';
        modalAudio.style.display = 'none';
    } else if (mediaElement.tagName === 'VIDEO') {
        modalVideo.src = mediaElement.src;
        modalVideo.style.display = 'block';
        modalImg.style.display = 'none';
        modalAudio.style.display = 'none';
    } else if (mediaElement.tagName === 'AUDIO') {
        modalAudio.src = mediaElement.src;
        modalAudio.style.display = 'block';
        modalImg.style.display = 'none';
        modalVideo.style.display = 'none';
    }

    closeButton.addEventListener('click', function() {
        modal.style.display = "none";
    });

    window.addEventListener('click', function(event) {
        const modal = document.getElementById("myModal");
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
}