import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";

export default async function History() {
  const session = await getSession();
  
  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  if (!user) {
    return null;
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [
        { from_upi: user.upi_id },
        { to_upi: user.upi_id }
      ]
    },
    orderBy: { timestamp: 'desc' },
  });

  return (
    <div className="flex flex-col min-h-screen bg-black px-4 pt-12 pb-24">
      <div className="flex items-center mb-8">
        <h1 className="text-2xl font-semibold text-white">Transaction History</h1>
      </div>

      <div className="space-y-4">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <Clock className="h-12 w-12 mb-4 opacity-20" />
            <p>No transactions yet</p>
          </div>
        ) : (
          transactions.map((tx: any) => {
            const isSent = tx.from_upi === user.upi_id;
            return (
              <div key={tx.txn_id} className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                <div className="flex items-center">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center mr-4 ${isSent ? 'bg-zinc-800' : 'bg-white/10'}`}>
                    {isSent ? <ArrowUpRight className="h-6 w-6 text-zinc-400" /> : <ArrowDownLeft className="h-6 w-6 text-white" />}
                  </div>
                  <div>
                    <p className="text-base font-medium text-white">
                      {isSent ? `To ${tx.to_upi}` : `From ${tx.from_upi}`}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                      {new Date(tx.timestamp).toLocaleString()}
                    </p>
                    {tx.type !== "transfer" && tx.type.startsWith("transfer: ") && (
                      <p className="text-xs text-zinc-400 mt-1">
                        Note: {tx.type.replace("transfer: ", "")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className={`text-base font-semibold ${isSent ? 'text-white' : 'text-green-400'}`}>
                    {isSent ? '-' : '+'}₹{tx.amount.toFixed(2)}
                  </div>
                  <div className="text-xs text-zinc-500 mt-1 capitalize">
                    {tx.status}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
