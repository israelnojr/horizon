import HeaderBox from '@/components/HeaderBox'
import RightSideBar from '@/components/RightSideBar'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import { loggedIn } from '@/constants'
import React from 'react'

const Home = () => {
  return (
    <section className={`home`} >
      <div className="home-content">
      <header className="home-header">
        <HeaderBox 
          type="greeting"
          title='Welcome'
          user={loggedIn?.firstName || "Guest"}
          subtext="Access and manage your account and trasactions efficiently."
        />
        <TotalBalanceBox 
          accounts={[]}
          totalBanks={5}
          totalCurrentBalance={18460.08}
        />
       </header>
       RECENT TRANSACTIONS
      </div>
      <RightSideBar user={loggedIn}
        transactions={[]}
        banks={[{currentBalance: 18460.08}, {currentBalance: 1256.90}]}
      />
    </section>
  )
}

export default Home