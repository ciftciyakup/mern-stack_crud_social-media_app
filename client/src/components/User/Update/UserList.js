import React from "react";

const UserList = ({ users, onDelete, userType }) => {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold mb-4">
        {userType === "guest" ? "Misafir Kullanıcılar" : "Turnuva Kayıt Kullanıcıları"}
      </h2>
      <div className="overflow-x-auto w-full">
        <table className="min-w-[350px] w-full bg-white shadow-md rounded-lg text-xs sm:text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="font-bold px-2 py-2 text-left whitespace-nowrap">Ad Soyad</th>
              <th className="font-bold px-2 py-2 text-left whitespace-nowrap">
                Kullanıcı Adı
              </th>
              <th className="font-bold px-2 py-2 text-left whitespace-nowrap">Telefon</th>
              {userType === "turnuvaKayit" && (
                <>
                  <th className="font-bold px-2 py-2 text-left whitespace-nowrap hidden xs:table-cell">
                    Ülke
                  </th>
                  <th className="font-bold px-2 py-2 text-left whitespace-nowrap hidden xs:table-cell">
                    Şehir
                  </th>
                  <th className="font-bold px-2 py-2 text-left whitespace-nowrap hidden xs:table-cell">
                    Kulüp
                  </th>
                </>
              )}
              <th className="font-bold px-2 py-2 text-left whitespace-nowrap">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-2 py-2 whitespace-nowrap">{user.fullname}</td>
                  <td className="px-2 py-2 whitespace-nowrap">{user.username}</td>
                  <td className="px-2 py-2 whitespace-nowrap">{user.phoneNumber}</td>
                  {userType === "turnuvaKayit" && (
                    <>
                      <td className="px-2 py-2 whitespace-nowrap hidden xs:table-cell">
                        {user.country || "Belirtilmemiş"}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap hidden xs:table-cell">
                        {user.city || "Belirtilmemiş"}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap hidden xs:table-cell">
                        {user.club || "Belirtilmemiş"}
                      </td>
                    </>
                  )}
                  <td className="px-2 py-2 whitespace-nowrap">
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs sm:text-sm"
                      onClick={() => onDelete(user._id)}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={userType === "turnuvaKayit" ? 7 : 4}
                  className="text-center px-4 py-4"
                >
                  Hiç kullanıcı bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
