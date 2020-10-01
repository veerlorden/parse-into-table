const button = document.getElementById('btn')
const container = document.getElementById('table-users')

// button.addEventListener('click', fetchUsers)
fetchUsers()
async function fetchUsers() {
  let response = await fetch('https://randomuser.me/api/?results=5')
  let json = await response.json()
  let list = addUsersOnPage(json.results)
  container.innerHTML = createTable(list)
}

function addUsersOnPage(users) {
  const usersList = users.map((user, index) => {
    return `
      <tr>
        <td class="index">${index + 1}</td>
        <td>${user.name.first}</td>
        <td>${user.name.last}</td>
        <td>${user.email}</td>
        <td>${user.location.city}</td>
        <td>${user.phone}</td>
        <td><img src="${user.picture.thumbnail}"></td>
      </tr>
    `
  })
  return usersList.join('')
}

function createTable(list) {
  return `
    <table>
      <thead>
        <tr>
          <th class="index">№</th>
          <th>First</th>
          <th>Last</th>
          <th>Email</th>
          <th>City</th>
          <th>Phone</th>
          <th>Photo</th>
        </tr>
      </thead>
      <tbody>
        ${list}
      </tbody>
    </table>
  `
}
