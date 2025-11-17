const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleDomo = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const food = e.target.querySelector('#domoFood').value;

    if (!name || !age || !food) {
        helper.handleError("All fields are required!");
        return false;
    }

    helper.sendPost(e.target.action, { name, age, food }, onDomoAdded);
    return false;
};

const DomoForm = (props) => {
    return (
        <form id='domoForm'
            onSubmit={(e) => handleDomo(e, props.triggerReload)}
            name='domoForm'
            action="/maker"
            method='POST'
            className='domoForm'
        >
            <label htmlFor='name'>Name: </label>
            <input id="domoName" type='text' name='name' placeholder='Domo Name' />
            <label htmlFor='age'>Age: </label>
            <input id='domoAge' type='number' min="0" name='age' />
            <label htmlFor='food'>Favorite Food: </label>
            <input id='domoFood' type='text' name='food' placeholder='favorite food' />
            <input className='makeDomoSumbit' type='submit' value="Make Domo" />

        </form>
    );
};

const DomoList = (props) => {
    const [domos, setDomos] = useState(props.domos);

    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getDomos');
            const data = await response.json();
            setDomos(data.domos);
        };

        loadDomosFromServer();
    }, [props.reloadDomos]);

    if (domos.length === 0) {
        return (
            <div className='domoList'>
                <h3 className='emptyDomo'>No Domos yet</h3>
            </div>
        );
    }

    const domoNodes = domos.map(domo => {
        return (
            <div key={domo._id} className='domo'>
                <img src='/assets/img/domoface.jpeg' alt='domo face' className='domoFace' />
                <h3 className='domoName'>Name: {domo.name}</h3>
                <h3 className='domoAge'>Age: {domo.age}</h3>
                <h3 className='domoFood'>Favorite Food: {domo.food}</h3>
            </div>
        );
    });

    return (
        <div className='domoList'>
            {domoNodes}
        </div>
    );
};


const handleChangePassword = (e) => {
    e.preventDefault();
    helper.hideError();

    const currentPassword = e.target.querySelector('#currentPassword').value;
    const newPass = e.target.querySelector('#newPass').value;
    const newPass2 = e.target.querySelector('#newPass2').value;

    if (!currentPassword || !newPass || !newPass2) {
        helper.handleError('All fields are required');
        return false;
    }

    if (newPass !== newPass2) {
        helper.handleError('Passwords do not match');
        return false;
    }

    helper.sendPost(e.target.action, { currentPassword, newPass, newPass2 });

    return false;
};

const ChangePasswordWindow = () => {
    return (
        <form id='changePasswordForm' name='changePasswordForm' onSubmit={handleChangePassword} action="/changePassword" method='POST' className='mainForm'>

            <label htmlFor="currentPassword">Current Password: </label>
            <input id="currentPassword" type="password" name="currentPasssword" placeholder="Current password" />
            <label htmlFor="newPass">New Password: </label>
            <input id="newPass" type="password" name="newPass" placeholder="New password" />
            <label htmlFor='pass'>Confirm New Password: </label>
            <input id='newPass2' type='password' name='newPass2' placeholder='Retype new password' />
            <input className="formSubmit" type="submit" value="Change Password" />
        </form>
    );
};

const App = () => {
    const [reloadDomos, setReloadDomo] = React.useState(false);
    const [showChangePassword, setShowChangePassword] = React.useState(false);

    React.useEffect(() => {
        const changeBtn = document.getElementById('changePassword');
        if (!changeBtn) return;

        const handleClick = (e) => {
            e.preventDefault(); // prevent browser navigation
            setShowChangePassword(true);
        };

        changeBtn.addEventListener('click', handleClick);
        return () => changeBtn.removeEventListener('click', handleClick);
    }, []);

    return (
        <div>
            {!showChangePassword && (
                <>
                    <DomoForm triggerReload={() => setReloadDomo(!reloadDomos)} />
                    <DomoList domos={[]} reloadDomos={reloadDomos} />
                </>
            )}

            {showChangePassword && <ChangePasswordWindow />}
        </div>
    );
};


const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;