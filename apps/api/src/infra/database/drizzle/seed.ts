import 'dotenv/config'

import path from 'node:path'

import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'


export const psychologists = [
    {
      "name": "John Doe",
      "avatar_url": "https://randomuser.me/api/portraits/men/32.jpg",
      "bio": "John is a software engineer with 5 years of experience developing web applications using React, Node.js and MongoDB. He is passionate about writing clean, reusable code and automating processes to optimize efficiency."
    },
    { 
      "name": "Jane Doe",
      "avatar_url": "https://randomuser.me/api/portraits/women/26.jpg",
      "bio": "Jane is a product manager with experience managing agile software development teams. She enjoys talking to users to understand their needs, defining product requirements and working closely with engineering to deliver excellent products."
    },
    {
      "name": "Bob Smith",
      "avatar_url": "https://randomuser.me/api/portraits/men/22.jpg",
      "bio": "Bob is a sales manager with 10 years of experience managing teams and exceeding sales quotas. He is an excellent communicator skilled at building strong relationships with clients and negotiating win-win deals."
    },
    {
      "name": "Mary Johnson",
      "avatar_url": "https://randomuser.me/api/portraits/women/22.jpg",
      "bio": "Mary is a marketing manager skilled at developing strategies to attract and retain customers. She stays up-to-date on the latest trends and technologies to engage audiences across multiple channels from email and social media to events and webinars."
    },
    {
      "name": "Mike Williams",
      "avatar_url": "https://randomuser.me/api/portraits/men/42.jpg",
      "bio": "Mike works in customer support helping clients troubleshoot issues and resolve complaints. His excellent communication skills and ability to remain calm under pressure enable him to provide exceptional service even in difficult situations."
    },
    {
      "name": "Sarah Davis",
      "avatar_url": "https://randomuser.me/api/portraits/women/32.jpg",
      "bio": "Sarah is a UX designer passionate about creating intuitive, user-friendly products that solve real problems for customers. She stays up-to-date on the latest design trends and frequently conducts user research to inform her work."
    },
    {
      "name": "Chris Miller",
      "avatar_url": "https://randomuser.me/api/portraits/men/12.jpg",
      "bio": "Chris is a front-end developer who enjoys using React to build responsive web apps with clean, modular code. He has experience optimizing sites for maximum speed and performance across devices."
    },
    {
      "name": "Lisa Wilson",
      "avatar_url": "https://randomuser.me/api/portraits/women/12.jpg",
      "bio": "Lisa is a back-end developer specializing in Node.js and MongoDB. She likes to write clean APIs and robust services to power complex front-end applications."
    },
    {
      "name": "Paul Rodriguez",
      "avatar_url": "https://randomuser.me/api/portraits/men/62.jpg",
      "bio": "Paul is a DevOps engineer focused on automation and continuous delivery. He enjoys provisioning infrastructure, configuring pipelines and monitoring systems to find and resolve issues quickly."
    },
    {
      "name": "Susan Anderson",
      "avatar_url": "https://randomuser.me/api/portraits/women/62.jpg", 
      "bio": "Susan is a data scientist who transforms raw data into actionable insights through statistical modeling and machine learning techniques. She communicates data findings clearly to drive business decisions."
    },
    {
      "name": "Mark Taylor",
      "avatar_url": "https://randomuser.me/api/portraits/men/82.jpg",
      "bio": "Mark is a database administrator with expertise in SQL Server, Oracle and MySQL. He develops optimal data architectures and enforces security policies to ensure systems are compliant and customer data is protected."
    },
    {
      "name": "Debra Martinez",
      "avatar_url": "https://randomuser.me/api/portraits/women/72.jpg",
      "bio": "Debra is an experienced project manager adept at leading cross-functional teams to deliver projects on time and under budget. She is an excellent communicator who is able to connect with stakeholders at all levels."
    },
    {
      "name": "Daniel Lewis",
      "avatar_url": "https://randomuser.me/api/portraits/men/92.jpg",
      "bio": "Daniel is a QA engineer responsible for ensuring software quality through extensive testing and attention"
    },
    {
      "name": "Daniel Lewis", 
      "avatar_url": "https://randomuser.me/api/portraits/men/92.jpg",
      "bio": "Daniel is a QA engineer responsible for ensuring software quality through extensive testing and attention to detail. He is skilled at writing test plans, executing test cases, logging defects and tracking issues to resolution."
    },
    {  
      "name": "Michelle Rodriguez",
      "avatar_url": "https://randomuser.me/api/portraits/women/93.jpg",
      "bio": "Michelle is an information security analyst dedicated to protecting systems and data from unauthorized access and cyber threats. She stays up-to-date on the evolving threat landscape to implement robust defenses." 
    },
    {
      "name": "Steven Howard",
      "avatar_url": "https://randomuser.me/api/portraits/men/43.jpg",
      "bio": "Steven is a solutions architect experienced in designing robust, scalable systems to meet business needs. He partners closely with stakeholders to understand requirements and translate them into practical, high-quality technical solutions."
    },
    {
      "name": "Amanda Phillips",
      "avatar_url": "https://randomuser.me/api/portraits/women/33.jpg",
      "bio": "Amanda is a business analyst who serves as a liaison between business and IT teams. She is skilled at understanding business needs, documenting requirements, defining solutions, and supporting implementation."
    },
    {
      "name": "Ryan Brooks",
      "avatar_url": "https://randomuser.me/api/portraits/men/13.jpg",
      "bio": "Ryan is a network engineer responsible for designing, building and maintaining high-performance network infrastructures. He has expertise across LAN/WAN systems, TCP/IP, routing, switching, firewalls and security."
    },
    {
      "name": "Andrea Flores", 
      "avatar_url": "https://randomuser.me/api/portraits/women/23.jpg",
      "bio": "Andrea is a technical writer who creates documentation for software products, including user guides, online help systems, and training materials. She has excellent communication skills and a talent for explaining complex topics clearly."
    },
    {
      "name": "Brandon Torres",
      "avatar_url": "https://randomuser.me/api/portraits/men/53.jpg", 
      "bio": "Brandon is a product designer who conducts user research to gain insights into customer needs and design user-friendly products that solve real-world problems. He is skilled at information architecture, interaction design, visual design and prototyping."
    },
    {
      "name": "Heather Cooper",
      "avatar_url": "https://randomuser.me/api/portraits/women/63.jpg",
      "bio": "Heather is an SEO specialist focused on improving organic search rankings by researching keywords, optimizing content, and building high-quality backlinks. She stays on top of algorithm updates and best practices."
    },
    {
      "name": "Jacob Clark",
      "avatar_url": "https://randomuser.me/api/portraits/men/73.jpg",
      "bio": "Jacob is a software architect who designs and evolves complex software systems to meet business and customer needs. He ensures software quality, performance, scalability, and security across the full software lifecycle."
    },
    {  
      "name": "Melissa Gonzales",
      "avatar_url": "https://randomuser.me/api/portraits/women/83.jpg",
      "bio": "Melissa is a web developer who builds and maintains websites and web applications. She has expertise in HTML, CSS, JavaScript, PHP and content management systems like WordPress."
    }
]


import * as schema from './schemas'
import { envSchema } from '../../../infra/env/env'

import { AuthPsychologistFactory } from '../../../../test/factories/auth/make-auth-psychologist'
import { DrizzleService } from './drizzle.service'
import { BcryptHasher } from '../../../infra/cryptography/bcrypt-hasher'

export async function seedPsychologist() {
  const env = envSchema.parse(process.env)

  const connection = postgres(env.DATABASE_URL, { max: 1 })

  const db = drizzle(connection, { schema, logger: false })

  const psychologistFactory = new AuthPsychologistFactory(new DrizzleService(db), new BcryptHasher())

  const queries: ReturnType<typeof psychologistFactory.makeDbPsychologist>[] = []

  for (let i = 0; i < 50; i++) {
    const query = psychologistFactory.makeDbPsychologist()
    queries.push(query)
  }

  await Promise.all(queries)

  await connection.end()
}

seedPsychologist().then(() => console.log('Psychologists seeded successfully!'))