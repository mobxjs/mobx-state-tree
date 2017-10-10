import React from "react"
import { observer, inject } from "mobx-react"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"

import "./DevTools.css"
import "react-tabs/style/react-tabs.css"

const DevTools = ({ history }) =>
    history ? (
        <div className="devtools">
            <Tabs>
                <TabList>
                    <Tab>Snapshots</Tab>
                    <Tab>Patches</Tab>
                    <Tab>Actions</Tab>
                </TabList>
                <TabPanel>
                    {history.snapshots.map((entry, idx) => (
                        <HistoryEntry key={idx} entry={entry} />
                    ))}
                </TabPanel>
                <TabPanel>
                    {history.patches.map((entry, idx) => <HistoryEntry key={idx} entry={entry} />)}
                </TabPanel>
                <TabPanel>
                    {history.actions.map((entry, idx) => <HistoryEntry key={idx} entry={entry} />)}
                </TabPanel>
            </Tabs>
        </div>
    ) : null

const HistoryEntry = ({ entry }) => (
    <pre className="history-entry" onClick={() => entry.replay()}>
        {JSON.stringify(entry.data, null, 2)}
    </pre>
)

export default inject("history")(observer(DevTools))
