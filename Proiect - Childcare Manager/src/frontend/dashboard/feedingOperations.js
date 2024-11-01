import { selectedDate } from './calendar.js';
import { getCurrentSelectedChild } from './childrenOperations.js';
import { setSelectedEntryId, getSelectedEntryId, getLocalISOString, showModal } from './dashboard.js';

export function fetchFeedingEntries(date, childID) {
    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        console.error('Tokenul JWT nu a fost găsit');
        alert('Tokenul JWT nu a fost găsit');
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
        .then(response => {
            if (response.status === 204)
                return null;
            return response.json();
        })
        .then(result => {
            if(result === null) {
                displayFeedingEntries([]);
                return;
            }
            if (result.feedingEntries) {
                displayFeedingEntries(result.feedingEntries);
            } else {
                displayFeedingEntries([]);
            }
        })
        .catch(error => {
            console.error('Eroare:', error);
            displayFeedingEntries([]);
        });
}

export function displayFeedingEntries(entries) {
    const feedingItemsContainer = document.getElementById("feeding_items");
    feedingItemsContainer.innerHTML = "";
    

    if (entries.length === 0) {
        feedingItemsContainer.innerHTML = "<p>Nu există înregistrări pentru această dată.</p>";
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
        entryDiv.addEventListener('click', function () {
            document.querySelectorAll('.calendar-item.selected').forEach(el => {
                el.classList.remove('selected');
            });
            entryDiv.classList.add('selected');
            setSelectedEntryId(entry.ID);
        });
        feedingItemsContainer.appendChild(entryDiv);
    });
}

export async function addMeal(e) {
    e.preventDefault();

    if (getCurrentSelectedChild() === null) {
        alert("Vă rugăm să selectați mai întâi un copil.");
        return;
    }

    const selectedChildId = getCurrentSelectedChild().dataset.childId;

    const useCurrentDateTime = document.getElementById('use-current-date-time-checkbox-meal').checked;
    let date, time;

    if (useCurrentDateTime) {
        const selectedDateObj = new Date(selectedDate);
        const year = selectedDateObj.getFullYear();
        const month = String(selectedDateObj.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDateObj.getDate()).padStart(2, '0');
        date = `${year}-${month}-${day}`;
        time = getLocalISOString().split(' ')[1];
    } else {
        date = document.getElementById('data_meal').value;
        time = document.getElementById('time_meal').value + ":00";
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


    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        console.error('Tokenul JWT nu a fost găsit');
        alert('Tokenul JWT nu a fost găsit');
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

        const result = await response.json();

        if (response.ok) {
            fetchFeedingEntries(selectedDate, selectedChildId);
            document.getElementById('meal-modal').style.display = 'none';
        } else {
            alert(`Eroare: ${result.message}`);
        }
    } catch (error) {
        console.error('Eroare:', error);
        alert('A apărut o eroare la adăugarea mesei');
    }
}

export async function editMeal(e) {
    e.preventDefault();

    if (getCurrentSelectedChild() === null) {
        alert("Vă rugăm să selectați mai întâi un copil.");
        return;
    }

    const selectedChildId = getCurrentSelectedChild().dataset.childId;

    const useCurrentDateTime = document.getElementById('use-current-date-time-checkbox-meal').checked;
    let date, time;

    if (useCurrentDateTime) {
        const selectedDateObj = new Date(selectedDate);
        const year = selectedDateObj.getFullYear();
        const month = String(selectedDateObj.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDateObj.getDate()).padStart(2, '0');
        date = `${year}-${month}-${day}`;
        time = getLocalISOString().split(' ')[1];
    } else {
        date = document.getElementById('data_meal').value;
        time = document.getElementById('time_meal').value + ":00";
    }

    const unit = document.getElementById('mass-selector').value === 'grame' ? 'g' : 'mg';
    const quantity = document.getElementById('mass-input').value;
    const foodType = document.getElementById('food').value;

    const payload = {
        ID: getSelectedEntryId(),
        Date: date,
        Time: time,
        Unit: unit,
        Quantity: parseInt(quantity, 10),
        FoodType: foodType,
    };


    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        console.error('Tokenul JWT nu a fost găsit');
        alert('Tokenul JWT nu a fost găsit');
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

        const result = await response.json();

        if (response.ok) {
            fetchFeedingEntries(selectedDate, selectedChildId);
            document.getElementById('meal-modal').style.display = 'none';
        } else {
            alert(`Eroare: ${result.message}`);
        }
    } catch (error) {
        console.error('Eroare: ', error);
        alert('A apărut o eroare la actualizarea mesei.');
    }
}

export function fetchFeedingEntryData() {
    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        alert('Tokenul JWT nu a fost găsit');
        return;
    }

    fetch(`http://localhost:5000/api/get_feeding_entry?id=${getSelectedEntryId()}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (response.status === 204)
                return null;
            return response.json();
        })
        .then(result => {
            if(result === null) return;
            if (result.feedingEntry) {
                autoCompleteFeedingForm(result.feedingEntry);
            } else {
                alert('Intrarea de masă nu a fost găsită');
            }
        })
        .catch(error => {
            console.error('Eroare la preluarea datelor intrării:', error);
            alert('A apărut o eroare la preluarea detaliilor intrării');
        });
}

export async function deleteFeedingEntry() {
    const cookieString = document.cookie;
    const token = cookieString.substring(4);

    if (!token) {
        console.error('Tokenul JWT nu a fost găsit');
        alert('Tokenul JWT nu a fost găsit');
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/delete_feeding_entry?id=${getSelectedEntryId()}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (response.ok) {
            const selectedChildId = getCurrentSelectedChild().dataset.childId;
            fetchFeedingEntries(selectedDate, selectedChildId);
        } else {
            alert(`Eroare: ${result.message}`);
        }
    } catch (error) {
        alert('A apărut o eroare la ștergerea mesei.');
    }
}

export function openMealModal(title, buttonText, submitHandler) {
    document.getElementById('meal-modal-title').textContent = title;
    document.getElementById('confirm-meal-bttn').textContent = buttonText;
    const form = document.getElementById('meal-form');
    form.onsubmit = submitHandler;
    showModal('meal-modal');
}

export function autoCompleteFeedingForm(entry) {
    document.getElementById('data_meal').value = entry.Date.split('T')[0];
    document.getElementById('time_meal').value = entry.Time.slice(0, 5);
    document.getElementById('mass-selector').value = entry.Unit === 'g' ? 'grame' : 'miligrame';
    document.getElementById('mass-input').value = entry.Quantity;
    document.getElementById('food').value = entry.FoodType;
}

export function resetMealForm() {
    document.getElementById('meal-form').reset();
    document.getElementById('use-current-date-time-checkbox-meal').checked = true;
    document.getElementById('date-and-time-inputs-meal').style.display = 'none';
}