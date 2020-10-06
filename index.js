const button = document.getElementById('btn')
const container = document.getElementById('table-users')
let seed = ''

// button.addEventListener('click', fetchUsers)
fetchUsers()
async function fetchUsers(page = 1) {
  const request = `https://randomuser.me/api/?page=${page}&results=50&seed=${seed}`
  let response = await fetch(request)
  let json = await response.json()
  seed = json.info.seed
  console.log(json)
  const list = addUsersOnPage(json.results)
  const pagination = addPagination(10)
  container.innerHTML = createTable(list, pagination)
}

document.addEventListener('click', (event) => {
  if (event.target.dataset.type === 'page') {
    const page = event.target.innerHTML
    fetchUsers(page)
  }
})

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

function addPagination(count) {
  let pagination = ''
  for (let i = 0; i < count; i++) {
    pagination += `
      <li data-type="page">${i + 1}</li>
    `
  }
  return pagination
}

function createTable(list, pagination) {
  return `
    <ul class="pagination">
      ${pagination}
    </ul>
    <table class="table_sort">
      <thead>
        <tr>
          <th>№</th>
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
    <ul class="pagination">
      ${pagination}
    </ul>
  `
}

document.addEventListener('DOMContentLoaded', () => {

  const getSort = ({ target }) => {
    const order = (target.dataset.order = -(target.dataset.order || -1));
    const index = [...target.parentNode.cells].indexOf(target);
    const collator = new Intl.Collator(['en', 'ru'], { numeric: true });
    const comparator = (index, order) => (a, b) => order * collator.compare(
      a.children[index].innerHTML,
      b.children[index].innerHTML
    );

    for (const tBody of target.closest('table').tBodies)
      tBody.append(...[...tBody.rows].sort(comparator(index, order)));

    for (const cell of target.parentNode.cells)
      cell.classList.toggle('sorted', cell === target);
  };

  document.querySelectorAll('.table_sort thead').forEach(tableTH => tableTH.addEventListener('click', () => getSort(event)));

});
